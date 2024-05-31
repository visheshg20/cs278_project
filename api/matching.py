from http.server import BaseHTTPRequestHandler
import json
import numpy as np
from scipy.stats import kendalltau
from sklearn_extra.cluster import KMedoids
from utils.supabase.server import createClient

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        users = json.loads(post_data.decode('utf-8'))

        supabase = createClient()
        survey_data = self.get_survey_data(supabase)

        if len(survey_data) < 9:
            groups = {0: survey_data}
            recommendations = {0: self.recommend_activity(survey_data, self.get_activity_list(survey_data))}
        else:
            groups, recommendations = self.group_users_and_recommend_activities(survey_data)

        response_data = {
            'groups': groups,
            'recommendations': recommendations
        }

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response_data).encode('utf-8'))

        self.update_user_groups(supabase, groups)

    def get_survey_data(self, supabase):
        response = supabase.table('survey').select('*').execute()
        survey_data = response.data
        for survey in survey_data:
            survey['group_activities_rankings'] = json.loads(survey['group_activities_rankings'])
        return survey_data

    def get_activity_list(self, survey_data):
        activity_set = set()
        for survey in survey_data:
            activity_set.update(survey['group_activities_rankings'].keys())
        return list(activity_set)

    def calculate_distances(self, survey_data):
        user_ids = [survey['user_id'] for survey in survey_data]
        num_users = len(user_ids)
        distance_matrix = np.zeros((num_users, num_users))

        for i in range(num_users):
            for j in range(i + 1, num_users):
                rankings1 = list(survey_data[i]['group_activities_rankings'].keys())
                rankings2 = list(survey_data[j]['group_activities_rankings'].keys())
                tau, _ = kendalltau(rankings1, rankings2)
                distance = 1 - tau
                distance_matrix[i][j] = distance_matrix[j][i] = distance
        return distance_matrix, user_ids

    def aggregate_rankings(self, group, activities):
        scores = {activity: 0 for activity in activities}
        for user in group:
            for activity, rank in user['group_activities_rankings'].items():
                scores[activity] += rank
        return scores

    def recommend_activity(self, group, activities):
        scores = self.aggregate_rankings(group, activities)
        recommended_activity = max(scores, key=scores.get)
        return recommended_activity

    def group_users_and_recommend_activities(self, survey_data, desired_group_size=5):
        np.random.seed(42)
        distance_matrix, user_ids = self.calculate_distances(survey_data)
        num_users = len(user_ids)
        num_groups = max(1, num_users // desired_group_size)
        activities = self.get_activity_list(survey_data)
        kmedoids = KMedoids(n_clusters=num_groups, metric='precomputed').fit(distance_matrix)
        clusters = kmedoids.labels_

        groups = {i: [] for i in range(num_groups)}
        activity_recommendations = {}
        for user_index, cluster_id in enumerate(clusters):
            groups[cluster_id].append(survey_data[user_index])

        for i, group in groups.items():
            activity_recommendations[i] = self.recommend_activity(group, activities)

        return groups, activity_recommendations

    def update_user_groups(self, supabase, groups):
        for group_id, members in groups.items():
            for member in members:
                user_id = member['user_id']
                supabase.table('Users').update({
                    'groups': supabase.raw('array_append(groups, ?)', [str(group_id)])
                }).eq('uid', user_id).execute()

    def find_user_group_and_activity(self, user_id, groups, activity_recommendations):
        for group_id, members in groups.items():
            if any(user['user_id'] == user_id for user in members):
                recommended_activity = activity_recommendations.get(group_id, "No activity recommended")
                return (group_id, recommended_activity)
        
        return None, "User not found in any group"

    def find_group_members(self, user_id, groups):
        for group_id, members in groups.items():
            if any(user['user_id'] == user_id for user in members):
                other_members = [user['user_id'] for user in members if user['user_id'] != user_id]
                return group_id, other_members
        
        return None, "User not found in any group"

    def find_common_activities(self, user1, user2, num_common=3):
        rankings1 = list(user1['group_activities_rankings'].keys())
        rankings2 = list(user2['group_activities_rankings'].keys())

        common_rankings = {}
        for activity in rankings1:
            if activity in rankings2:
                avg_rank = (user1['group_activities_rankings'][activity] + user2['group_activities_rankings'][activity]) / 2
                common_rankings[activity] = avg_rank

        sorted_activities = sorted(common_rankings, key=common_rankings.get)

        return sorted_activities[:num_common]

    def find_common_preferences(self, user1, user2):
        values1 = set(user1['values'])
        values2 = set(user2['values'])
        activities1 = set(user1['activities'])
        activities2 = set(user2['activities'])

        common_values = list(values1.intersection(values2))
        common_activities = list(activities1.intersection(activities2))

        return {
            'common_values': common_values,
            'common_free_time_activities': common_activities
        }