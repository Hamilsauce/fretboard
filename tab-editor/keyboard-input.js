 class KeyboardNavigator extends EventTarget {
   #target
   
   constructor(target, options) {
     super();
     
     this.#target = target;
     
     this.#target.addEventListener('keyup', e => {
       const currentTarget = e.currentTarget
       const target = e.target
       const key = `${e.key}`.toLowerCase();
       
       if (key.includes('arrow')) {
         this.dispatchEvent(new CustomEvent(`keyboardnav`, {
           detail: { direction: key.replace('arrow', '') }
         }));
       }
     });
     
   };
   
   get target() { return this.#target };
 }
 
 export const initKeyboard = (inputEl) => {
   return new KeyboardNavigator(inputEl)
 };