export default async function handler(req, res){

  if(req.method !== 'POST'){
    return res.status(405).json({
      error:'Method not allowed'
    });
  }

  try{

    const { code } = req.body;

    if(!code){
      return res.status(400).json({
        error:'Missing code'
      });
    }

    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    });

    const githubRes = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':
            'application/x-www-form-urlencoded'
        },
        body: params.toString()
      }
    );

    const data = await githubRes.json();

    if(data.error){
      return res.status(400).json(data);
    }

    res.status(200).json(data);

  }catch(err){

    console.error(err);

    res.status(500).json({
      error:'Internal server error'
    });
  }
}
