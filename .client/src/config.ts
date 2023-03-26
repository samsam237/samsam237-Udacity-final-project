// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'ojk894dsq1' // 
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-vifnimxlyp44sm2b.us.auth0.com',            // Auth0 domain
  clientId: '6ow1i0bmln7Tkd7RzepPkpz76Vt8yYhH',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

// POST - https://ojk894dsq1.execute-api.us-east-1.amazonaws.com/dev/todos
// GET - https://810noeq73m.execute-api.us-east-1.amazonaws.com/