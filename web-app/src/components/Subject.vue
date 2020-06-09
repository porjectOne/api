<template>
  <v-data-table
    :headers="headers"
    :items="datas"
    sort-by="subject"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>รายวิชา</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
          </template>
           <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.sub_id" label="รหัสวิชา"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.sub_thai" label="ชื่อวิชาภาษาไทย"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.sub_eng" label="ชื่อวิชาภาษาอังกฤษ"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.sub_credit" label="หน่วยกิต"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card> 
        </v-dialog>
        
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
//import datas from "./../mockup/subject.json"
import Axios from 'axios'

export default {
    data: () => ({
      dialog: false,
      headers: [
        {
          text: 'รหัสวิชา',
          align: 'start',
          sortable: false,
          value: 'sub_id',
        },
        { text: 'ชื่อวิชาภาษาไทย', value: 'sub_thai' },
        { text: 'ชื่อวิชาภาษาอังกฤษ', value: 'sub_eng' },
        { text: 'หน่วยกิต', value: 'sub_credit' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      subject: [],
      editedIndex: -1,
      editedItem: {
      },
      defaultItem: {
        sub_id: '',
        sub_thai:'',
        sub_eng: '',
        sub_credit: ''
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.editedItem = this.defaultItem,
        this.fetchSubject();
      },

      async fetchSubject(){
        await Axios.get(this.$mainUrl + "subject")
          .then((res) => { this.subject = res.data })
          .catch(err => alert(err));
      },

      editItem (item) {
        this.editedIndex = this.subject.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      async deleteItem (item) {
        const index = this.subject.indexOf(item)
        var sure = confirm('Are you sure you want to delete this item?')
        if (sure) {
          await Axios.delete(this.$mainUrl + "subject/" + this.subject[index].id)
            .then(() => {
              this.subject.splice(index, 1)
            })
            .catch(err => alert(err));
        }
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      async save () {
        if (this.editedIndex > -1) {
          await Axios.put(this.$mainUrl + "subject/" + this.subject[this.editedIndex].id, this.editedItem)
            .then(() => {
              Object.assign(this.subject[this.editedIndex], this.editedItem)
            })
            .catch(err => alert(err));
        } else {
          await Axios.post(this.$mainUrl + "subject", this.editedItem)
            .then(() => {
              this.subject.push(this.editedItem)
            })
            .catch(err => alert(err));
        }
        this.close()
      },
    },
  }
</script>