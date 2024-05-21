<template>
  <div class="form__group field">
    <input type="text" class="form__field" placeholder="Name">
    <label for="name" class="form__label">Name</label>
</div>
</template>

<script>
export default {

}
</script>

<style>
.form__group {
  position: relative;
  padding: 20px 0 0;
  width: 100%;
  max-width: 180px;
}

.form__field {
  width: 100%;
  border: none;
  border-bottom: 0.5px solid #9b9b9b;
  outline: 0;
  font-size: 17px;
  color: #fff;
  padding: 7px 0;
  background: transparent;
  transition: border-color 0.2s;
}

.form__field::placeholder {
  color: transparent;
}

.form__field:placeholder-shown ~ .form__label {
  font-size: 17px;
  cursor: text;
  top: 20px;
}

.form__label {
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 17px;
  color: #9b9b9b;
  pointer-events: none;
}

.form__field:focus {
  padding-bottom: 6px;
  border-width: 2px;
  border-image: linear-gradient(#FFBD59,#FFBD59);
  border-image-slice: 1;
}

.form__field:focus ~ .form__label {
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 17px;
  color: #E6C591;
}

/* reset input */
.form__field:required, .form__field:invalid {
  box-shadow: none;
}
</style>