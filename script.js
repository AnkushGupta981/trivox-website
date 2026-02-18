// DARK MODE
function toggleDark(){
  document.body.classList.toggle('dark');
}

// CONTACT FORM VALIDATION
function validateForm(){
  let email=document.getElementById("email").value;
  if(!email.includes("@")){
    alert("Invalid Email");
    return false;
  }
  alert("Message Sent!");
  return true;
}

// BACK TO TOP
window.onscroll=function(){
  let btn=document.getElementById("topBtn");
  if(document.documentElement.scrollTop>200){
    btn.style.display="block";
  }else{
    btn.style.display="none";
  }
}
function topFunction(){
  document.documentElement.scrollTop=0;
}
