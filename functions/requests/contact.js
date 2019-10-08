const express = require('express');
const bearerToken = require('express-bearer-token');
const libphonenumber = require('libphonenumber-js')
const cors = require('cors');
const app = express();
const admin = require("firebase-admin");

function Contact(){}

Contact.request = app.use(bearerToken());

// for parsing application/json
Contact.request = app.use(express.json()) 

// Automatically allow cross-origin requests
Contact.request = app.use(cors({ origin: true }));


Contact.request = app.post('/synccontact', async (req,res)=>{
  const countryCode = "ID"
  const numCode = "62"
  const currentAccessToken = req.token
  if(!currentAccessToken){
    res.status(401).send("null token");
  }
  const requesterUserId = req.body.userId
  const phoneNumbers = req.body.phonenumbers
  if(!Array.isArray(phoneNumbers)){
    res.status(400).send("phonenumbers value must be array data type");
  }
  const db = admin.firestore();
  const userRef = db.collection("users");
  const userMappingRef = db.collection("userMapping").doc(requesterUserId)
  const userMappingSnapshot = await userMappingRef.get()
  if(userMappingSnapshot.data() && userMappingSnapshot.data().accessToken){
    const dbAccessToken = userMappingSnapshot.data().accessToken
    if(dbAccessToken!==currentAccessToken){
      res.status(401).send("wrong token");
    }
  }else{
    res.status(401).send("null db token");

  }
  const userSnapshot = await userRef.get();
  const users = userSnapshot.docs.map( (snap) => {
    let user = Object.assign({id: snap.id})
    if(snap.data().phoneNumber){
      user = Object.assign({id: snap.id, phone: snap.data().phoneNumber.value})
    }
    return user
  });
  const phones = users.map((obj)=> obj.phone);
  phoneNumbers.forEach( async(item) => {
    let result = item.toString()
    result = result.replace(/-/g, '')

    //result = validatePhoneNumber(result, countryCode, numCode)
    if(result.length<=2){
      return
    }
    const phoneNumber1 = libphonenumber.parsePhoneNumberFromString(result, countryCode)
    if(phoneNumber1 && phoneNumber1.isPossible()){
      // check if there is `+` 
      if(result.substring(0,1)==="+"){
        result = result.substr(1);
      }
      if(!result.toLowerCase().match(/^[0-9]+$/)){
        return 
      }
      // change 0 to numCode 
      if(result.substring(0,1)==="0"){
        result = result.substr(1);
        result = numCode+""+result
      }
      // if 2 first letter is not same with numCode, add the numCode at the beginning
      if(result.substring(0,2)!==numCode){
        result = numCode+""+result
      }
  
      const phoneNumber2 = libphonenumber.parsePhoneNumberFromString("+"+result, countryCode)
      
      if(phoneNumber2.isValid()){
        const index = phones.indexOf(result)
        if(index>0){
          const userId = users[index].id
          // check user himself (cannot add yourself to friendList)
          if(userId!==requesterUserId){
            const userFriendListRef = db.collection("friendList").doc(requesterUserId)
            const userPeopleRef = userFriendListRef.collection("people").doc(userId)
            const peopleFriendListRef = db.collection("friendList").doc(userId)
            const peoplePeopleRef = peopleFriendListRef.collection("people").doc(requesterUserId)
            
            const promises = [ 
          
            ];

            const userPeopleSnapshot = await userPeopleRef.get()
            const peoplePeopleSnapshot = await peoplePeopleRef.get()
          

            if(!userPeopleSnapshot.exists){
              promises.push(userPeopleRef.set({ creationTime: admin.firestore.FieldValue.serverTimestamp(), source: {id: "autosync" ,value: "Auto Sync"} }));
            }
            if(!peoplePeopleSnapshot.exists){
              promises.push(peoplePeopleRef.set({ creationTime: admin.firestore.FieldValue.serverTimestamp(), source: {id: "autosync", value: "Auto Sync"} }));
            }

            await Promise.all(promises);

          }
         
        }

      }
    }
  })
  res.status(200).send("ok");
});

module.exports = Contact;