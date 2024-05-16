<template>
    <form @submit.prevent="signupHandle">
      <div>
          <label>Email:</label>
          <input type="email" v-model="email" required><br>
          <label>Username:</label>
          <input type="text" v-model="username" required><br>
          <label>Password:</label>
          <input type="password" v-model="password" required><br>
          <label>Confirm password:</label>
          <input type="password" v-model="repassword" required><br>
          <label>First name:</label>
          <input type="password" v-model="firstname" required>
          <label>Last name:</label>
          <input type="password" v-model="lastname" required><br>
          <label>Phone:</label>
          <input type="tel" v-model="phone" required><br>
          <label>Address:</label>
          <input type="text" v-model="address" required><br>
          <button type="submit">Sign up</button><br>
      </div>
      <div>
			<span>Already have an account? </span><router-link to="/login">Log in here</router-link>
      </div>
    </form>
  </template>