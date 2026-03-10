import axios from 'axios';
import {GoogleAuthProvider} from 'firebase/auth';
const {OAuth2Client} = require('google-auth-library');

const provider = new GoogleAuthProvider();
const client = new OAuth2Client(process.env.GOOGLE_ID);

/*
    - title: 구글 및 페이스북 로그인 됬는지 확인
    - params:
{
  type: 'facebook' || 'google'
}
*/

const getGoogleRefresh = async code => {
  //authorization_code로 액세스 리프레시 둘다 가져오기
  return await axios.request({
    url: 'token',
    method: 'post',
    baseURL: 'https://oauth2.googleapis.com/',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      client_id: process.env.GOOGLE_ID,
      client_secret: process.env.GOOGLE_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.NEXT_PUBLIC_HOME_URL,
    }),
  });
};

const getGoogleAccess = async t => {
  //액세스 토큰 가져오기
  return await axios.request({
    url: 'token',
    method: 'post',
    baseURL: 'https://oauth2.googleapis.com/',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      client_id: process.env.GOOGLE_ID,
      client_secret: process.env.GOOGLE_SECRET,
      refresh_token: t,
      grant_type: 'refresh_token',
      redirect_uri: process.env.NEXT_PUBLIC_HOME_URL,
    }),
  });
};

export default async (req, res) => {
  const {type, code} = req.query;
  if (type == 'google') {
    const tokens =
      code == 'refresh_token'
        ? await getGoogleAccess(req.query.refresh_token)
        : await getGoogleRefresh(code); //req.query의 code가 'refresh_token' 이면 액세스 코드만 갱신하고, 아니면 리프레시, 액세스 다 가져옴
    if (tokens.status == 200) {
      async function verify() {
        const ticket = await client.verifyIdToken({
          //tokens 안에 있는 id 토큰으로 사용자의 고유 id와 이름을 가져옴
          idToken: tokens.data.id_token,
          audience: process.env.GOOGLE_ID, // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];

        return payload;
      }
      const p = await verify().catch(console.error);
      res.json({
        success: true,
        data: {...tokens.data, id: p.sub, name: p.name},
      });
      res.statusCode = 200;
      res.end();
    } else {
      res.json({success: false, data: tokens.data});
      res.statusCode = 403;
      res.end();
    }
  } else if (type == 'facebook') {
    // 페북의 경우 리프레시 토큰이 없고 단기 액세스 토큰을 장기 액세스 토큰으로 바꿀 수 있음
    const getFacebookRefresh = async t => {
      //장기 액세스 토큰 가져오기
      return await axios.get('https://graph.facebook.com/v10/oauth/access_token/', {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: process.env.FACEBOOK_ID,
          client_secret: process.env.FACEBOOK_SECRET,
          fb_exchange_token: t,
        },
      });
    };
    const tokens = getFacebookRefresh(code);
    res.json({success: true, data: tokens.data});
    res.statusCode = 200;
    res.end();
  } else {
    res.json({success: true});
    res.statusCode = 200;
    res.end();
  }
};
