const { auth } = require('../config/Firebase');

const listAllUsers = async (nextPageToken, users = []) => {
    // List batch of users, 1000 at a time.
    const appUsers = await auth
        .listUsers(1000, nextPageToken)
        .then(listUsersResult => {
            listUsersResult.users.forEach(userRecord => {
                // fetch the required details
                const { uid, phoneNumber, displayName } = userRecord;

                users.push({ uid, phoneNumber, displayName });
            });

            if (listUsersResult.pageToken) {
                // List next batch of users.
                listAllUsers(listUsersResult.pageToken, users);
            }

            return users;
        })
        .catch(error => {
            console.log('Error listing users:', error);
        });

    return appUsers;
};

module.exports = listAllUsers;
