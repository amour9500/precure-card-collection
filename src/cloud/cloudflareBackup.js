const API_URL=(import.meta.env.VITE_BACKUP_API_URL||'').replace(/\/$/,'');
const TOKEN=import.meta.env.VITE_BACKUP_TOKEN||'';
function config(method,body){if(!API_URL)throw new Error('VITE_BACKUP_API_URLが未設定です');if(!TOKEN)throw new Error('VITE_BACKUP_TOKENが未設定です');return {method,headers:{'Content-Type':'application/json','Authorization':`Bearer ${TOKEN}`},...(body?{body:JSON.stringify(body)}:{})};}
export async function uploadBackup(payload){const r=await fetch(`${API_URL}/backup`,config('PUT',payload));const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||`保存失敗: ${r.status}`);return data;}
export async function downloadBackup(){const r=await fetch(`${API_URL}/backup`,config('GET'));const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||`復元失敗: ${r.status}`);return data;}
