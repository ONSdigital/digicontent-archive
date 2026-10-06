
const Startbutton = document.getElementById('Start-button');

function toInfoState() {
document.getElementById("Mouse-arrows").style.display ="none";
document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
removeTabStateOptions();
}

const infoPages = document.getElementsByClassName('InfoPage');
const array =  Array.from("infoPages");
console.log(infoPages)
console.log(array)

function toDefaultState() {
  document.getElementById("Start-page").style.display ="none";
  Startbutton.removeAttribute('tabindex');
  document.getElementById("Mouse-arrows").style.display ="inline";
  document.getElementById("Default-clickable-shapes").style.display ="line";
  document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
  document.getElementById("Smartphone-info").style.display ="none";
  document.getElementById("Thermostat-info").style.display ="none";
  document.getElementById("Vacuum-info").style.display ="none";
  document.getElementById("Keys-info").style.display ="none";
  document.getElementById("Storeroom-info").style.display ="none";
  document.getElementById("TV-info").style.display ="none";
  document.getElementById("Speaker-info").style.display ="none";
  document.getElementById("Till-info").style.display ="none";
  document.getElementById("Telephone-info").style.display ="none";
  document.getElementById("Computer-info").style.display ="none";
  document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//  Array.from("infoPages").forEach(e => e.style.display ="none");
  addTabStateOptions();
  removeCrossTabStateOptions();
  }
  

 




// //Keys
// // open

// document.getElementById("Mouse-keys").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Keys-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };

// document.getElementById("Keys_x5F_click-area").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Keys-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };


// // close

// document.getElementById("Keys-Background_x5F_click-area").onclick = function(){
//     document.getElementById("Keys-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
//   };
// document.getElementById("Keys-Cross_x5F_click-area").onclick = function(){
//   document.getElementById("Keys-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
// };
// //Vacuum
// // open

// document.getElementById("Mouse-vacuum").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Vacuum-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };

// document.getElementById("Vacuum_x5F_click-area").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Vacuum-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };

// // close

// document.getElementById("Vacuum-Background-click-area").onclick = function(){
//     document.getElementById("Vacuum-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
//   };
// document.getElementById("Vacuum-Cross_x5F_click-area").onclick = function(){
//   document.getElementById("Vacuum-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
// };

// //TV
// // open

// document.getElementById("Mouse-TV").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Keys-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };

// document.getElementById("TV_x5F_click-area").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("TV-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };

// // close

// document.getElementById("TV-Background_x5F_click-area").onclick = function(){
//     document.getElementById("TV-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
//   };
// document.getElementById("TV-Cross_x5F_click-area").onclick = function(){
//   document.getElementById("TV-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
// };

// //thermostat
// // open

// document.getElementById("Thermostat_x5F_click-area").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Thermostat-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };


// document.getElementById("Mouse-thermostat").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Thermostat-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };


// // close

// document.getElementById("Thermostat-Background_x5F_click-area").onclick = function(){
//     document.getElementById("Thermostat-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
//   };
// document.getElementById("Thermostat-Cross_x5F_click-area").onclick = function(){
//   document.getElementById("Thermostat-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
// };
// //Speaker
// // open

// document.getElementById("Speaker_x5F_click-area").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Speaker-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };

// document.getElementById("Mouse-speaker").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Speaker-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };


// // close

// document.getElementById("Speaker-Background_x5F_click-area").onclick = function(){
//     document.getElementById("Speaker-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
//   };
// document.getElementById("Speaker-Cross_x5F_click-area").onclick = function(){
//   document.getElementById("Speaker-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
// };


// //Till
// // open

// document.getElementById("Till_x5F_click-area").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Till-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };


// document.getElementById("Mouse-till").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Till-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };
// // close

// document.getElementById("Till-Background_x5F_click-area").onclick = function(){
//     document.getElementById("Till-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
//   };
// document.getElementById("Till-Cross_x5F_click-area").onclick = function(){
//   document.getElementById("Till-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
// };


// //Storeroom
// // open
// document.getElementById("Mouse-storeroom").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Storeroom-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };

// document.getElementById("Storeroom_x5F_click-area").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Storeroom-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };

// // close

// document.getElementById("Storeroom-Background_x5F_click-area").onclick = function(){
//     document.getElementById("Storeroom-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
//   };
// document.getElementById("Storeroom-Cross_x5F_click-area").onclick = function(){
//   document.getElementById("Storeroom-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
// };
// //Computer
// // open

// document.getElementById("Computer_x5F_click-area").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Computer-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };
// document.getElementById("Mouse-computer").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Computer-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };
// // close

// document.getElementById("Computer-Background_x5F_click-area").onclick = function(){
//     document.getElementById("Computer-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
//   };
// document.getElementById("Computer-Cross_x5F_click-area").onclick = function(){
//   document.getElementById("Computer-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
// };


// //Telephone
// // open

// document.getElementById("Telephone_x5F_click-area").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Telephone-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };

// document.getElementById("Mouse-telephone").onclick = function(){
//   document.getElementById("Mouse-arrows").style.display ="none";
//   document.getElementById("Telephone-info").style.display ="inline";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
// };

// // close

// document.getElementById("Telephone-Background_x5F_click-area").onclick = function(){
//     document.getElementById("Telephone-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
//   };
// document.getElementById("Telephone-Cross_x5F_click-area").onclick = function(){
//   document.getElementById("Telephone-info").style.display ="none";
//   document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//   document.getElementById("Mouse-arrows").style.display ="inline";
// };


// const keyB = document.getElementById('keyB');
// Add tabindex to make the elements focusable
Startbutton.setAttribute('tabindex', '0');
// keyB.setAttribute('tabindex', '0');


function addTabStateOptions() {

MouseSmartphone.setAttribute('tabindex', '2');
MouseKeys.setAttribute('tabindex', '3');
MouseVacuum.setAttribute('tabindex', '4');
MouseThermostat.setAttribute('tabindex', '5');
MouseSpeaker.setAttribute('tabindex', '7');
MouseTV.setAttribute('tabindex', '6');
MouseTill.setAttribute('tabindex', '8');
MouseStoreroom.setAttribute('tabindex', '9');
MouseComputer.setAttribute('tabindex', '10');
MouseTelephone.setAttribute('tabindex', '11');
}

function removeTabStateOptions() {

  MouseSmartphone.removeAttribute('tabindex');
  MouseKeys.removeAttribute('tabindex');
  MouseVacuum.removeAttribute('tabindex');
  MouseThermostat.removeAttribute('tabindex');
  MouseSpeaker.removeAttribute('tabindex');
  MouseTV.removeAttribute('tabindex');
  MouseTill.removeAttribute('tabindex');
  MouseStoreroom.removeAttribute('tabindex');
  MouseComputer.removeAttribute('tabindex');
  MouseTelephone.removeAttribute('tabindex');

}

function removeCrossTabStateOptions() {

  CrossSmartphone.removeAttribute('tabindex');
  CrossKeys.removeAttribute('tabindex');
  CrossVacuum.removeAttribute('tabindex');
  CrossThermostat.removeAttribute('tabindex');
  CrossSpeaker.removeAttribute('tabindex');
  CrossTV.removeAttribute('tabindex');
  CrossTill.removeAttribute('tabindex');
  CrossStoreroom.removeAttribute('tabindex');
  CrossComputer.removeAttribute('tabindex');
  CrossTelephone.removeAttribute('tabindex');
}










const MouseSmartphone = document.getElementById('Mouse-smartphone');
const MouseKeys = document.getElementById('Mouse-keys');
const MouseVacuum = document.getElementById('Mouse-vacuum');
const MouseThermostat = document.getElementById('Mouse-thermostat');
const MouseSpeaker = document.getElementById('Mouse-speaker');
const MouseTV = document.getElementById('Mouse-TV');
const MouseTill = document.getElementById('Mouse-till');
const MouseStoreroom = document.getElementById('Mouse-storeroom');
const MouseComputer = document.getElementById('Mouse-computer');
const MouseTelephone = document.getElementById('Mouse-telephone');

const CrossSmartphone = document.getElementById('Smartphone-Cross_x5F_click-area');
const CrossKeys = document.getElementById('Keys-Cross_x5F_click-area');
const CrossVacuum = document.getElementById('Vacuum-Cross_x5F_click-area');
const CrossThermostat = document.getElementById('Thermostat-Cross_x5F_click-area');
const CrossSpeaker = document.getElementById('Speaker-Cross_x5F_click-area');
const CrossTV = document.getElementById('TV-Cross_x5F_click-area');
const CrossTill = document.getElementById('Till-Cross_x5F_click-area');
const CrossStoreroom = document.getElementById('Storeroom-Cross_x5F_click-area');
const CrossComputer = document.getElementById('Computer-Cross_x5F_click-area');
const CrossTelephone = document.getElementById('Telephone-Cross_x5F_click-area');

// const StartpageClickArea = document.getElementById('Start-page-background_x5F_click-area')
const StartbuttonClickArea = document.getElementById('Start-button')

// const SmartphoneBackgroundClickArea = document.getElementById('Smartphone-Background_x5F_click-area')
// const KeysBackgroundClickArea = document.getElementById('Keys-Background_x5F_click-area')
// const VacuumBackgroundClickArea = document.getElementById('Vacuum-Background_x5F_click-area')
// const ThermostatBackgroundClickArea = document.getElementById('Thermostat-Background_x5F_click-area')
// const SpeakerBackgroundClickArea = document.getElementById('Speaker-Background_x5F_click-area')
// const TillBackgroundClickArea = document.getElementById('Till-Background_x5F_click-area')
// const ComputerBackgroundClickArea = document.getElementById('Computer-Background_x5F_click-area')
// const TelephoneBackgroundClickArea = document.getElementById('Telephone-Background_x5F_click-area')
// const StoreroomBackgroundClickArea = document.getElementById('Storeroom-Background_x5F_click-area')
// const TVBackgroundClickArea = document.getElementById('TV-Background_x5F_click-area')

const SmartphoneClickArea = document.getElementById('Smartphone_x5F_click-area')
const KeysClickArea = document.getElementById('Keys_x5F_click-area')
const VacuumClickArea = document.getElementById('Vacuum_x5F_click-area')
const ThermostatClickArea = document.getElementById('Thermostat_x5F_click-area')
const SpeakerClickArea = document.getElementById('Speaker_x5F_click-area')
const TillClickArea = document.getElementById('Till_x5F_click-area')
const ComputerClickArea = document.getElementById('Computer_x5F_click-area')
const TelephoneClickArea = document.getElementById('Telephone_x5F_click-area')
const StoreroomClickArea = document.getElementById('Storeroom_x5F_click-area')
const TVClickArea = document.getElementById('TV_x5F_click-area')
const Overlay = document.getElementById("Overlay_x5F_Night-blue")
//click event listeners
StartbuttonClickArea.addEventListener('click', StartbuttonClickEvent);
SmartphoneClickArea.addEventListener('click', SmartphoneClickEvent);
KeysClickArea.addEventListener('click', KeysClickEvent);
VacuumClickArea.addEventListener('click',VacuumClickEvent);
ThermostatClickArea.addEventListener('click', ThermostatClickEvent);
SpeakerClickArea.addEventListener('click', SpeakerClickEvent);
TVClickArea.addEventListener('click', TVClickEvent);
StoreroomClickArea.addEventListener('click', StoreroomClickEvent);
ComputerClickArea.addEventListener('click', ComputerClickEvent);
TelephoneClickArea.addEventListener('click', TelephoneClickEvent);
TillClickArea.addEventListener('click', TillClickEvent);

// Add keyboard event listeners
Startbutton.addEventListener('keydown', StartbuttonClickEvent);
MouseSmartphone.addEventListener('keydown', SmartphoneClickEvent);
MouseKeys.addEventListener('keydown', KeysClickEvent);
MouseVacuum.addEventListener('keydown',VacuumClickEvent);
MouseThermostat.addEventListener('keydown', ThermostatClickEvent);
MouseSpeaker.addEventListener('keydown', SpeakerClickEvent);
MouseTV.addEventListener('keydown', TVClickEvent);
MouseStoreroom.addEventListener('keydown', StoreroomClickEvent);
MouseComputer.addEventListener('keydown', ComputerClickEvent);
MouseTelephone.addEventListener('keydown', TelephoneClickEvent);
MouseTill.addEventListener('keydown', TillClickEvent);

Overlay.addEventListener('click', OverlayClickEvent);




CrossSmartphone.addEventListener('keydown', SmartphoneCloseEvent);
CrossKeys.addEventListener('keydown', KeysCloseEvent);
CrossVacuum.addEventListener('keydown',VacuumCloseEvent);
CrossThermostat.addEventListener('keydown', ThermostatCloseEvent);
CrossSpeaker.addEventListener('keydown', SpeakerCloseEvent);
CrossTV.addEventListener('keydown', TVCloseEvent);
CrossStoreroom.addEventListener('keydown', StoreroomCloseEvent);
CrossComputer.addEventListener('keydown', ComputerCloseEvent);
CrossTelephone.addEventListener('keydown', TelephoneCloseEvent);
CrossTill.addEventListener('keydown', TillCloseEvent);

//click event listeners
Startbutton.addEventListener('click', StartbuttonClickEvent);
MouseSmartphone.addEventListener('click', SmartphoneClickEvent);
MouseKeys.addEventListener('click', KeysClickEvent);
MouseVacuum.addEventListener('click',VacuumClickEvent);
MouseThermostat.addEventListener('click', ThermostatClickEvent);
MouseSpeaker.addEventListener('click', SpeakerClickEvent);
MouseTV.addEventListener('click', TVClickEvent);
MouseStoreroom.addEventListener('click', StoreroomClickEvent);
MouseComputer.addEventListener('click', ComputerClickEvent);
MouseTelephone.addEventListener('click', TelephoneClickEvent);
MouseTill.addEventListener('click', TillClickEvent);

CrossSmartphone.addEventListener('click', SmartphoneCloseEvent);
CrossKeys.addEventListener('click', KeysCloseEvent);
CrossVacuum.addEventListener('click',VacuumCloseEvent);
CrossThermostat.addEventListener('click', ThermostatCloseEvent);
CrossSpeaker.addEventListener('click', SpeakerCloseEvent);
CrossTV.addEventListener('click', TVCloseEvent);
CrossStoreroom.addEventListener('click', StoreroomCloseEvent);
CrossComputer.addEventListener('click', ComputerCloseEvent);
CrossTelephone.addEventListener('click', TelephoneCloseEvent);
CrossTill.addEventListener('click', TillCloseEvent);



// // Handle  events
// function StartbuttonClickEvent(event) {
//   if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
//     toDefaultState()  
    
//    };
//   }


function OverlayClickEvent(event) {
  if (event.type == 'click') {
    toDefaultState();
      
   };
   
  }

// Handle  events
function SmartphoneClickEvent(event) {
  if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
    toInfoState();
    document.getElementById("Smartphone-info").style.display ="inline";  
    CrossSmartphone.setAttribute('tabindex', '1');
  
   };
   
  }

  function KeysClickEvent(event) {
    if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
      toInfoState();
      document.getElementById("Keys-info").style.display ="inline"; 
      CrossKeys.setAttribute('tabindex', '0');

     };
    }

  function VacuumClickEvent(event) {
    if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
      toInfoState();
      document.getElementById("Vacuum-info").style.display ="inline"; 
      CrossVacuum.setAttribute('tabindex', '0');
      
     };
    }
    function ThermostatClickEvent(event) {
      if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
        toInfoState();
        document.getElementById("Thermostat-info").style.display ="inline"; 
        CrossThermostat.setAttribute('tabindex', '0');
       };
      }
      function SpeakerClickEvent(event) {
        if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
          toInfoState();
          document.getElementById("Speaker-info").style.display ="inline"; 
          CrossSpeaker.setAttribute('tabindex', '0');
         };
        }

        function TillClickEvent(event) {
          if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
            toInfoState() ;
            document.getElementById("Till-info").style.display ="inline"; 
            CrossTill.setAttribute('tabindex', '0');
           };
          }
          function StoreroomClickEvent(event) {
            if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
              toInfoState();
              document.getElementById("Storeroom-info").style.display ="inline"; 
              CrossStoreroom.setAttribute('tabindex', '0');
             };
            }
            function ComputerClickEvent(event) {
              if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
                toInfoState() ;
                document.getElementById("Computer-info").style.display ="inline"; 
                CrossComputer.setAttribute('tabindex', '0');
               };
              }
                        
              function TVClickEvent(event) {
                if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
                  toInfoState();
                  document.getElementById("TV-info").style.display ="inline"; 
                  CrossTV.setAttribute('tabindex', '0');
                 };
                }

                function TelephoneClickEvent(event) {
                  if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
                    toInfoState();
                    document.getElementById("Telephone-info").style.display ="inline"; 
                    CrossTelephone.setAttribute('tabindex', '0');
                   };
                  }
      
                  

                  

// Handle  events
function StartbuttonClickEvent(event) {
  if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
    toDefaultState();
      };
  }


// Handle  events
function SmartphoneCloseEvent(event) {
  if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
    toDefaultState()    
   };
  }

  function KeysCloseEvent(event) {
    if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
      toDefaultState()    
     };
    }

  function VacuumCloseEvent(event) {
    if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
      toDefaultState()    
     };
    }
    function ThermostatCloseEvent(event) {
      if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
        toDefaultState()    
       };
      }
      function SpeakerCloseEvent(event) {
        if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
          toDefaultState()    
         };
        }

        function TillCloseEvent(event) {
          if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
            toDefaultState()    
           };
          }
          function StoreroomCloseEvent(event) {
            if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
              toDefaultState()    
             };
            }
            function ComputerCloseEvent(event) {
              if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
                toDefaultState()    
               };
              }
                        
              function TVCloseEvent(event) {
                if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
                  toDefaultState()    
                 };
                };

                function TelephoneCloseEvent(event) {
                  if (event.key === 'Enter' ||  event.key === ' ' || event.type == 'click') {
                    toDefaultState()    
                   };
                  }


//   document.getElementById("Smartphone_x5F_click-area").onclick = function(){
//     document.getElementById("Smartphone-info").style.display ="inline";
//     toInfoState();
//     // document.getElementById("Mouse-arrows").style.display ="none";
//     // document.getElementById("Default-clickable-shapes").style.display ="none";
//     // document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";    
//   };
  
//   document.getElementById("Mouse-smartphone").onclick = function(){
//     document.getElementById("Mouse-arrows").style.display ="none";
//     document.getElementById("Smartphone-info").style.display ="inline";
//     document.getElementById("Default-clickable-shapes").style.display ="none";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
//   };
  
//   // close
  
//   document.getElementById("Smartphone-Background_x5F_click-area").onclick = function(){
//       document.getElementById("Smartphone-info").style.display ="none";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//     document.getElementById("Mouse-arrows").style.display ="inline";
//     };
//   document.getElementById("Smartphone-Cross_x5F_click-area").onclick = function(){
//     document.getElementById("Smartphone-info").style.display ="none";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//     document.getElementById("Mouse-arrows").style.display ="inline";
//   };
  
  

    
// // Handle keydown events
// function Smartphoneclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="none";
//     document.getElementById("Smartphone-info").style.display ="inline";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
//     removeTabStateOptions();
//     CrossSmartphone.setAttribute('tabindex', '0');
//    };
//   }


//   // Handle keydown events
// function Keysclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="none";
//     document.getElementById("Keys-info").style.display ="inline";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
//     removeTabStateOptions();
//     CrossKeys.setAttribute('tabindex', '0');
//    };
//   }
//   // Handle keydown events
// function Vacuumclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="none";
//     document.getElementById("Vacuum-info").style.display ="inline";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
//     removeTabStateOptions();
//     CrossVacuum.setAttribute('tabindex', '0');
//    };
//   }
//   // Handle keydown events
// function Thermostatclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="none";
//     document.getElementById("Thermostat-info").style.display ="inline";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
//     removeTabStateOptions();
//     CrossThermostat.setAttribute('tabindex', '0');
//    };
//   }
//   // Handle keydown events
// function TVclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="none";
//     document.getElementById("TV-info").style.display ="inline";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
//     removeTabStateOptions();
//     CrossTV.setAttribute('tabindex', '0');
//    };
//   }
//   // Handle keydown events
// function Speakerclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="none";
//     document.getElementById("Speaker-info").style.display ="inline";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
//     removeTabStateOptions();
//     CrossSpeaker.setAttribute('tabindex', '0');
//    };
//   }
//   // Handle keydown events
// function Tillclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="none";
//     document.getElementById("Till-info").style.display ="inline";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
//     removeTabStateOptions();
//     CrossTill.setAttribute('tabindex', '0');
//    };
//   }
//   // Handle keydown events
// function Storeroomclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="none";
//     document.getElementById("Storeroom-info").style.display ="inline";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
//     CrossStoreroom.setAttribute('tabindex', '0');
//     removeTabStateOptions();
//    };
//   }
//   // Handle keydown events
// function Computerclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="none";
//     document.getElementById("Computer-info").style.display ="inline";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
//     CrossComputer.setAttribute('tabindex', '0');
//     removeTabStateOptions(); 
//   };
//   }
//   // Handle keydown events
// function Telephoneclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="none";
//     document.getElementById("Telephone-info").style.display ="inline";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="inline";
    
//     CrossTelephone.setAttribute('tabindex', '0');
//     removeTabStateOptions();
//    };
//   }



// // Handle keydown events
// function Smartphonecrossclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="inline";
//     document.getElementById("Smartphone-info").style.display ="none";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//     removeCrossTabStateOptions();
//     addTabStateOptions();
//    };
//   }


  

//   // Handle keydown events
// function Keyscrossclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="inline";
//     document.getElementById("Keys-info").style.display ="none";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//     CrossKeys.setAttribute('tabindex', '0');
//     removeCrossTabStateOptions();
//     addTabStateOptions();
//    };
//   }
//   // Handle keydown events
// function Vacuumcrossclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="inline";
//     document.getElementById("Vacuum-info").style.display ="none";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//     CrossVacuum.setAttribute('tabindex', '0');
//     removeCrossTabStateOptions();
//     addTabStateOptions();
//    };
//   }
//   // Handle keydown events
// function Thermostatcrossclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="inline";
//     document.getElementById("Thermostat-info").style.display ="none";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//     removeCrossTabStateOptions();
//     addTabStateOptions();
//    };
//   }
//   // Handle keydown events
// function TVcrossclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="inline";
//     document.getElementById("TV-info").style.display ="none";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//     removeCrossTabStateOptions();
//     addTabStateOptions();
//    };
//   }
//   // Handle keydown events
// function Speakercrossclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="inline";
//     document.getElementById("Speaker-info").style.display ="none";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//     removeCrossTabStateOptions();
//     addTabStateOptions();
//    };
//   }
//   // Handle keydown events
// function Tillcrossclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="inline";
//     document.getElementById("Till-info").style.display ="none";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//       removeCrossTabStateOptions();
//     addTabStateOptions();
//    };
//   }
//   // Handle keydown events
// function Storeroomcrossclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="inline";
//     document.getElementById("Storeroom-info").style.display ="none";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//        removeCrossTabStateOptions();
//     addTabStateOptions();
//    };
//   }
//   // Handle keydown events
// function Computercrossclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="inline";
//     document.getElementById("Computer-info").style.display ="none";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//     removeCrossTabStateOptions();
//     addTabStateOptions();
//    };
//   }
//   // Handle keydown events
// function Telephonecrossclick(event) {
//   if (event.key === 'Enter' || event.key === ' ') {
//     // Perform desired action when Enter or Spacebar is pressed
//     document.getElementById("Mouse-arrows").style.display ="inline";
//     document.getElementById("Telephone-info").style.display ="none";
//     document.getElementById("Overlay_x5F_Night-blue").style.display ="none";
//     removeCrossTabStateOptions();
//     addTabStateOptions();
//    };
//   }






new pym.Child();