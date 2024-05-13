from http.server import BaseHTTPRequestHandler
import json
import numpy as np
from scipy.stats import kendalltau
from sklearn_extra.cluster import KMedoids

class handler(BaseHTTPRequestHandler):
 
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        users = json.loads(post_data.decode('utf-8'))

        groups, recommendations = self.group_users_and_recommend_activities(users)

        response_data = {
            'groups': groups,
            'recommendations': recommendations
        }

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response_data).encode('utf-8'))

    def calculate_distances(self, users):
        user_ids = list(users.keys())
        num_users = len(user_ids)
        distance_matrix = np.zeros((num_users, num_users))

        for i in range(num_users):
            for j in range(i + 1, num_users):
                tau, _ = kendalltau(users[user_ids[i]]['rankings'], users[user_ids[j]]['rankings'])
                distance = 1 - tau
                distance_matrix[i][j] = distance_matrix[j][i] = distance
        return distance_matrix, user_ids

    def aggregate_rankings(self, group, activities):
        scores = {activity: 0 for activity in activities}
        for user in group:
            for rank, activity in enumerate(user['rankings']):
                scores[activity] += (len(activities) - rank)
        return scores

    def recommend_activity(self, group, activities):
        scores = self.aggregate_rankings(group, activities)
        recommended_activity = max(scores, key=scores.get)
        return recommended_activity

    def group_users_and_recommend_activities(self, users, desired_group_size=5):
        np.random.seed(42)
        distance_matrix, user_ids = self.calculate_distances(users)
        num_users = len(user_ids)
        num_groups = max(1, num_users // desired_group_size)
        activities = list(users[next(iter(users))]['rankings'])
        kmedoids = KMedoids(n_clusters=num_groups, metric='precomputed').fit(distance_matrix)
        clusters = kmedoids.labels_

        groups = {i: [] for i in range(num_groups)}
        activity_recommendations = {}
        for user_index, cluster_id in enumerate(clusters):
            groups[cluster_id].append(users[user_ids[user_index]])

        for i, group in groups.items():
            activity_recommendations[i] = self.recommend_activity(group, activities)

        return groups, activity_recommendations

    def find_user_group_and_activity(self, user_id, groups, activity_recommendations):
        for group_id, members in groups.items():
            if any(user['name'] == user_id for user in members):
                recommended_activity = activity_recommendations.get(group_id, "No activity recommended")
                return (group_id, recommended_activity)
        
        return None, "User not found in any group"

    def find_group_members(self, user_id, groups):
        for group_id, members in groups.items():
            if any(user['name'] == user_id for user in members):
                other_members = [user['name'] for user in members if user['name'] != user_id]
                return group_id, other_members
        
        return None, "User not found in any group"

    def find_common_activities(self, user1, user2, num_common=3):
        rankings1 = user1['rankings']
        rankings2 = user2['rankings']

        common_rankings = {}
        for activity in rankings1:
            if activity in rankings2:
                avg_rank = (rankings1.index(activity) + rankings2.index(activity)) / 2
                common_rankings[activity] = avg_rank

        sorted_activities = sorted(common_rankings, key=common_rankings.get)

        return sorted_activities[:num_common]

    def find_common_preferences(self, user1, user2):
        values1 = set(user1['values'])
        values2 = set(user2['values'])
        activities1 = set(user1['free_time_activities'])
        activities2 = set(user2['free_time_activities'])

        common_values = list(values1.intersection(values2))
        common_activities = list(activities1.intersection(activities2))

        return {
            'common_values': common_values,
            'common_free_time_activities': common_activities
        }