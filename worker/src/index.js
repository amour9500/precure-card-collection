const KEY = 'backups/precure-card-backup.json';
function headers(origin, env) {
  const allowed = env.ALLOWED_ORIGIN || origin || '*';
  return {'Access-Control-Allow-Origin': allowed,'Access-Control-Allow-Methods':'GET,PUT,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Authorization','Content-Type':'application/json; charset=utf-8','Vary':'Origin'};
}
export default {
  async fetch(request, env) {
    const origin=request.headers.get('Origin')||''; const h=headers(origin,env);
    if(request.method==='OPTIONS') return new Response(null,{status:204,headers:h});
    const url=new URL(request.url);
    if(url.pathname!=='/backup') return new Response(JSON.stringify({error:'Not found'}),{status:404,headers:h});
    if(!env.BACKUP_TOKEN || request.headers.get('Authorization')!==`Bearer ${env.BACKUP_TOKEN}`) return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers:h});
    if(request.method==='PUT') {
      const body=await request.text();
      try { JSON.parse(body); } catch { return new Response(JSON.stringify({error:'Invalid JSON'}),{status:400,headers:h}); }
      await env.BACKUP_BUCKET.put(KEY,body,{httpMetadata:{contentType:'application/json'}});
      return new Response(JSON.stringify({ok:true,updatedAt:new Date().toISOString()}),{headers:h});
    }
    if(request.method==='GET') {
      const object=await env.BACKUP_BUCKET.get(KEY);
      if(!object) return new Response(JSON.stringify({error:'Backup not found'}),{status:404,headers:h});
      return new Response(object.body,{headers:h});
    }
    return new Response(JSON.stringify({error:'Method not allowed'}),{status:405,headers:h});
  }
};
