export default async function handler(req, res){

  const code=req.query.code;

  if(!code){
    return res.status(400).json({
      error:'Missing code'
    });
  }

  try{

    const githubRes=await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          client_id:process.env.GITHUB_CLIENT_ID,
          client_secret:process.env.GITHUB_CLIENT_SECRET,
          code
        })
      }
    );

    const data=await githubRes.json();

    if(data.error){
      return res.status(400).json(data);
    }

    res.redirect(
      `/?token=${data.access_token}`
    );

  }catch(err){

    res.status(500).json({
      error:'OAuth failed'
    });
  }
}
