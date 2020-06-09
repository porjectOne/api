<template>
      <v-container
        class="fill-height"
        fluid
      >
     <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form @submit="userSignIn" @keyup.native.enter="userSignIn">
                  <v-text-field
                    v-model="username"
                    label="Login"
                    name="login"
                    prepend-icon="person"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    v-model="password"
                    label="Password"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="userSignIn">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
</template>

<script>
  export default {
      data() {
          return {
              username: '',
              password: ''
          }
      },
      mounted: 
        function () {
      },
      methods: {
          userSignIn() {
              this.$http.post(this.$mainUrl + 'login', { username: this.username, password: this.password })
          .then(request => this.loginSuccessful(request))
          .catch(() => this.loginFailed())
        },
        loginSuccessful (req) {
          if (!req.data.id) {
            this.loginFailed()
            return
          }
          localStorage.setItem('user', req.data.id)
          this.$store.dispatch('login')
          this.$router.push('room');
          // alert('login')
          // this.$router.replace(this.$route.query.redirect || '/room')
        },
        loginFailed () {
          this.$store.dispatch('logout')
          localStorage.removeItem('user')
          alert("username or password wrong !")
        }
      }
  }
</script>