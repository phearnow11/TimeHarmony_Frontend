import { defineStore } from "pinia";
import axios from "axios";
var api = import.meta.env.VITE_API_PORT
export const useMailStore = defineStore("mail", {
  state: () => ({

  }),
  actions: {
    send(email, subject, content){
        axios.post(`${api}/mail/send-to/${email}`,{
            subject: subject,
            content: content
        })
        .then(res=>{
            console.log(res);
        })
    },
    sendAttach(email, subject, content, attach){
        axios.post(`${api}/mail/send-to/attachment/${email}`,{
            subject: subject,
            content: content,
            path_attachment: attach 
        })
        .then(res=>{
            console.log(res);
        })
    }
  },
});
