document.addEventListener('keydown', (e)=>{
   if(["1","2","3"].includes(e.key)) {
       press(parseInt(e.key));
   }
});

document.addEventListener('keyup', (e)=>{
   if(["1","2","3"].includes(e.key)) {
       release(parseInt(e.key));
   }
});