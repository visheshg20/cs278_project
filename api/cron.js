const { createClient } = require('@/utils/supabase/server');
const axios = require('axios');

const supabase = createClient();

const runMatchingAlgorithm = async () => {
  try {
    const response = await axios.post('https://your-vercel-app.com/api/matching');
    console.log('Matching algorithm executed successfully');
    console.log('Response:', response.data);

    const { groups } = response.data;

    for (const groupId in groups) {
      const groupMembers = groups[groupId];

      for (const member of groupMembers) {
        const { user_id } = member;

        const { data, error } = await supabase
          .from('Users')
          .update({ groups: supabase.raw('array_append(groups, ?)', [groupId]) })
          .eq('uid', user_id);

        if (error) {
          console.error('Error updating user groups:', error);
        } else {
          console.log(`User ${user_id} added to group ${groupId}`);
        }
      }
    }
  } catch (error) {
    console.error('Error running matching algorithm:', error);
  }
};

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    await runMatchingAlgorithm();
    res.status(200).json({ message: 'Matching algorithm executed' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};