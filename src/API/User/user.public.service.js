const admin = require('firebase-admin');
const { ApiError } = require('../../_helpers/apiError')
const httpStatus = require('http-status')


async function getUserByEmail(email) {
	try {
	  const userRecord = await admin.auth().getUserByEmail(email);
	  return userRecord;
	} catch (error) {
	  if (error.code === 'auth/user-not-found') {
		return null;
	  }
	  console.error('Error fetching user by email:', error);
	  throw error;
	}
  }

  async function verifyAccessToken(accessToken) {
	try {
	  const decodedToken = await admin.auth().verifyIdToken(accessToken);
	  return decodedToken;
	} catch (error) {
	//   console.error('Error verifying access token:', error);
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Token")
	}
  }


  async function linkProviderToUser(existingUid, newProviderData) {
    try {
      const user = await admin.auth().getUser(existingUid);
      await admin.auth().updateUser(existingUid, {
        providerData: [...user.providerData, newProviderData]
      });
      console.log('Provider linked successfully');
    } catch (error) {
      console.error('Error linking provider:', error);
    }
  }

  async function revokeRefreshToken(uid) {
    try {
      await admin.auth().revokeRefreshTokens(uid);
      console.log(`Refresh tokens revoked for user: ${uid}`);
    } catch (error) {
      console.error('Error revoking refresh tokens:', error);
    }
  }




  module.exports={
    verifyAccessToken,
    getUserByEmail,
    linkProviderToUser,
    revokeRefreshToken


  }