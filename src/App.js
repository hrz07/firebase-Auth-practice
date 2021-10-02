import { initializeApp } from 'firebase/app';
import './App.css';
import {useState} from 'react';
import firebaseConfig from './firebase.config';
import { getAuth,signOut, signInWithPopup,updateProfile, createUserWithEmailAndPassword,signInWithEmailAndPassword , GoogleAuthProvider,FacebookAuthProvider } from "firebase/auth";
import * as firebase from 'firebase/app';



firebase.initializeApp(firebaseConfig);


function App() {

  const [newdata, SetNewData] = useState(false);
  const [state, setState] = useState({
    isSignedIn : false,
    name : '',
    email : '',
    password : '',
    photo : '',
    error : '',
    success : false
  });

  const provider = new GoogleAuthProvider();
  const handleSignIn = () =>{
    const auth = getAuth();
    signInWithPopup(auth, provider)
    .then(res => {
      const {displayName,email,photoURL} = res.user;
      const signedInUser = {
        isSignedIn : true,
        name : displayName,
        email : email,
        photo : photoURL
      }

      setState(signedInUser);

    } )
  }


  const handleSignOut = () =>{
    const auth = getAuth();
    signOut(auth)
    .then(() => {
      const signOutUser = {
        isSignedIn : false,
        name : '',
        email : '',
        photo : ''
      }

      setState(signOutUser);

})
  }

  const fbprovider = new FacebookAuthProvider();
  const fbSignIn = () =>{

  const auth = getAuth();
  signInWithPopup(auth, fbprovider)
  .then((result) => {
    console.log('fb user after sign in', result.user);
  })
  .catch((error) => { 
    console.log(error);
  });
}

  const handleInput = (e) =>{
   let isValiedForm = true;

    if(e.target.name === 'email'){
      isValiedForm =  /\S+@\S+\.\S+/.test(e.target.value);
      

    }if(e.target.name === 'password'){
      const passLengthValied = e.target.value.length > 5 ;
      const passNumbervalied = /\d{1}/.test(e.target.value);
      isValiedForm = (passLengthValied && passNumbervalied);
    }if(isValiedForm){
      const newDataList = {...state};
      newDataList[e.target.name] = e.target.value;
      setState(newDataList);
    }
  }
  

  const handleSubmit = (e) =>{

    // sign Up user

    if(newdata &&  state.email && state.password){

      const auth = getAuth();
    createUserWithEmailAndPassword(auth, state.email, state.password)
    .then( res => {
      

      const newStateData = {...state};

      newStateData.error = ''
      newStateData.success = true;
      newStateData.success = res;
      setState(newStateData);
      updateUserData(state.name);
    })
    .catch((error) => {
      
      
      const newStateData = {...state};
      newStateData.success = false;
      newStateData.error = 'This Email Is Already Used';
      
      setState(newStateData);
    });

    
    }
    e.preventDefault();

    // Login User

    if(!newdata && state.email && state.password){
      const auth = getAuth();
      signInWithEmailAndPassword(auth, state.email, state.password)

      .then( res => {
        
        console.log(res);
        const newStateData = {...state};
  
        newStateData.error = ''
        newStateData.success = true;
        newStateData.success = res;
        setState(newStateData);
       
  })
  .catch((error) => {
    
    
      const newStateData = {...state};
      newStateData.success = false;
      newStateData.error = 'This Email Is Already Used';
      
      setState(newStateData);
     });
    }
  }


  const updateUserData = (name) =>{
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: name
    }).then(() => {
      console.log('Data Updated Successfully');
      
    }).catch((error) => {
      console.log(error);
    });
  }



  return (
    <div className="App">
      <h4>Authentication</h4>

    <button onClick={fbSignIn}>Sign In by Facebook</button>
    <br/>
     {
       state.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> : <button onClick={handleSignIn}>Sign In</button>
      
    }
     {
       state.isSignedIn && <div>
        <p>Welcome, {state.name} </p>
        <p>Your Email : {state.email} </p>
        <img src={state.photo} alt=""/>
       </div>  
     }

     <h1>Our Own Authentication</h1>


     <input type="checkbox" name="checkbox" onChange={()=>{SetNewData(!newdata)}} />
     <label htmlFor="checkbox">Create a new account</label>
     
     <form onSubmit={handleSubmit} >
     { newdata && <input type="text" name='name' placeholder='Enter your name' onBlur={handleInput}  />}
     <br/>
     <input type="email" name='email' placeholder='Enter your Email' onBlur={handleInput} />
     <br/>
     <input type="password" name='password' placeholder='Enter your Password' onBlur={handleInput} />
     <br/>
     <input type="submit" value={newdata ? 'Sign Up' : 'Sign In'} />
     </form>
     <p style={{color : 'red'}}>{state.error}</p>
     {state.success ? <p style={{color : 'green'}} > {newdata ? 'Sign up' : 'Sign in' } Successfully</p> : '' }

    </div>
  );
}

export default App;
