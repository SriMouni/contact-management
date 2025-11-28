// Fill these values with your real Cognito details before running:
// - region
// - userPoolId
// - userPoolWebClientId
// - domain
// - redirectSignIn / redirectSignOut

const awsExports = {
  Auth: {
    region: "ap-south-1",
    userPoolId: "ap-south-1_inssViSXJ",
    userPoolWebClientId: "3q88v19hbkeumvkdtf1oa854v4",
    oauth: {
      domain: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_inssViSXJ",
      scope: ["openid", "email", "profile"],
      redirectSignIn: "https://main.d3ghn4ei9xs2ok.amplifyapp.com/",
      redirectSignOut: "https://main.d3ghn4ei9xs2ok.amplifyapp.com/",
      responseType: "code",
    },
  },
};

export default awsExports;
