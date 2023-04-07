<template>
  <div>
    <Breadcrumbs title="Register" />
    <section class="register-page section-b-space">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <h3>{{ title }}</h3>
            <div class="theme-card">
              <form class="theme-form" @submit.prevent="onSubmit">
                <div class="row">
                  <div class="col-md-6">
                    <label for="First name">First Name</label>
                    <input type="text" class="form-control" id="First name" v-model="fname" placeholder="First Name"
                      name="First name" required />
                  </div>
                  <div class="col-md-6">
                    <label for="lname">Last Name</label>
                    <input type="text" class="form-control" id="lname" v-model="lname" placeholder="Last Name"
                      name="lname" required />
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" v-model="email" placeholder="Email" name="email"
                      required />
                  </div>
                  <div class="col-md-6">
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password" v-model="password"
                      placeholder="Enter your password" name="password" required />
                  </div>
                  <div class="col-6">
                    <button type="submit" class="btn btn-solid mt-2" :disabled="invalid">create account</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>

import Breadcrumbs from '../../../components/widgets/breadcrumbs'
export default {
  components: {

    Breadcrumbs,

  },
  data() {
    return {
      title: 'create account',
      fname: null,
      lname: null,
      email: null,
      password: null
    }
  },
  methods: {
    onSubmit() {
    }
  }
}
</script>
