import { defineStore } from "pinia";
import { createClient } from "@supabase/supabase-js";
import { useAuthStore } from "./auth";

const supabaseUrl = "https://ehictsgsriefiguyhlvq.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaWN0c2dzcmllZmlndXlobHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE4OTk1NjYsImV4cCI6MjAzNzQ3NTU2Nn0.k9rDNn_xvgNDN7JHW19JXKh_B9M3w3cUa0aijSuABGU";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useChatStore = defineStore('chat', {
  state: () => ({
    user: null,
    messages: [],
    error: null,
    selected: null,
    subscription: null,
  }),
  actions: {
    async registerUser() {
      const authStore = useAuthStore();
      const userId = authStore.user_id;

      try {
        const { data: existingUser, error: existingUserError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (existingUserError && existingUserError.code !== 'PGRST116') {
          throw existingUserError;
        }

        if (!existingUser) {
          const { error: insertError } = await supabase
            .from('users')
            .insert([{ id: userId }]);

          if (insertError) throw insertError;
        }

        const { data: user, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (fetchError) throw fetchError;

        this.user = user;
        this.error = null;
      } catch (error) {
        this.error = error.message;
        console.error('Registration failed:', error);
      }
    },

    async registerUser2(userId) {
      try {
        const { data: existingUser, error: existingUserError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (existingUserError && existingUserError.code !== 'PGRST116') {
          throw existingUserError;
        }

        if (!existingUser) {
          const { error: insertError } = await supabase
            .from('users')
            .insert([{ id: userId }]);

          if (insertError) throw insertError;
        }
      } catch (error) {
        this.error = error.message;
        console.error('Registered failed:', error);
      }
    },

    async autoLogin() {
      try {
        await this.registerUser();
        this.subscribeToMessages();
      } catch (error) {
        this.error = error.message;
      }
    },

    async fetchMessages(receiverId) {
      const authStore = useAuthStore();
      const userId = authStore.user_id;
    
      try {
        const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });
    
        if (error) throw error;
    
        this.messages = data;
      } catch (error) {
        this.error = error.message;
      }
    },

    async sendMessage(receiverId, text) {
      try {
        
      }catch{}
      const authStore = useAuthStore();
      const userId = authStore.user_id;
      
      if (!text.trim()) return;
      
      try {
        // Insert the new message
        const { data, error } = await supabase
          .from('messages')
          .insert([{ id: crypto.randomUUID(), sender_id: userId, receiver_id: receiverId, text }])
          .select();
        
        if (error) throw error;
    
        // Fetch updated messages to include the newly sent message
        await this.fetchMessages(receiverId);
      } catch (error) {
        this.error = error.message;
        console.error('Error sending message:', error);
      }
    },

    subscribeToMessages() {
      const authStore = useAuthStore();
      const userId = authStore.user_id;
    
      if (this.subscription) {
        this.unsubscribeFromMessages();
      }
    
      this.subscription = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${userId}`,
          },
          payload => {
            console.log('New message:', payload.new);
            if(payload.new.sender_id==import.meta.env.VITE_ADMIN_USERID){
              console.log("YOU HAVE BEEN BANNED!");
              useAuthStore().logout()
            }
            this.messages.push(payload.new);
          }
        )
        .subscribe();
    },

    unsubscribeFromMessages() {
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }
    },
  }
});