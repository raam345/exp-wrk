let n=document.getElementById("name"),
m=document.getElementById("mail"),
p=document.getElementById("pass"),
ph=document.getElementById("ph"),
f=document.getElementById("f"),
msg=document.getElementById("msg");

function v(i,e,c){
  if(c){i.className="ok";e.textContent=""}
  else{i.className="bad";e.textContent="Invalid"}
}

n.addEventListener("input",()=>v(n,e1,n.value.trim()!==""))
m.addEventListener("input",()=>v(m,e2,/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(m.value)))
p.addEventListener("input",()=>v(p,e3,p.value.length>=6&&/[!@#$%^&*]/.test(p.value)))
ph.addEventListener("input",()=>v(ph,e4,/^\d{10}$/.test(ph.value)))

f.addEventListener("submit",e=>{
  e.preventDefault()
  if(n.className=="ok"&&m.className=="ok"&&p.className=="ok"&&ph.className=="ok")
    msg.textContent="Registration Successful!"
  else msg.textContent="Fix errors first."
})
