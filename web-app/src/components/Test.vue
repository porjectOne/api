<template>
  <v-data-table
    :headers="headers"
    :items="datas"
    sort-by="test"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>ตารางสอบ</v-toolbar-title>
        <v-divider
          class="mx-7"
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
                    <v-text-field v-model="editedItem.sub_thai" label="ชื่อวิชา"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.date_test" label="วันที่สอบ"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.time_test" label="เวลาที่สอบ"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.building" label="อาคาร"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.room_id" label="ห้องสอบ"></v-text-field>
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
//import datas from "./../mockup/scheduleExam.json"
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
        { text: 'ชื่อวิชา', value: 'sub_thai' },
        { text: 'วันที่สอบ', value: 'date_test' },
        { text: 'เวลาที่สอบ', value: 'time_test' },
        { text: 'อาคาร', value: 'building' },
        { text: 'ห้องสอบ', value: 'room_id' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      datas: [],
      editedIndex: -1,
      editedItem: {
      },
      defaultItem: {
        sub_id: '',
        sub_thai:'',
        date_test: '',
        time_test: '',
        building: '',
        room_id: ''
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
        this.fetchTest();
      },

      async fetchTest(){
        await Axios.get(this.$mainUrl + "test")
          .then((res) => { this.test = res.data })
          .catch(err => alert(err));
      },

      editItem (item) {
        this.editedIndex = this.test.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      async deleteItem (item) {
        const index = this.test.indexOf(item)
        var sure = confirm('Are you sure you want to delete this item?')
        if (sure) {
          await Axios.delete(this.$mainUrl + "test/" + this.test[index].id)
            .then(() => {
              this.test.splice(index, 1)
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
          await Axios.put(this.$mainUrl + "test/" + this.test[this.editedIndex].id, this.editedItem)
            .then(() => {
              Object.assign(this.test[this.editedIndex], this.editedItem)
            })
            .catch(err => alert(err));
        } else {
          await Axios.post(this.$mainUrl + "test", this.editedItem)
            .then(() => {
              this.test.push(this.editedItem)
            })
            .catch(err => alert(err));
        }
        this.close()
      },
    },
  }
</script>