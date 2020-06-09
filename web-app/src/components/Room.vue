<template>
  <v-data-table
    :headers="headers"
    :items="rooms"
    sort-by="room"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Room</v-toolbar-title>
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
                    <v-text-field v-model="editedItem.room_id" label="ห้อง"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.building" label="อาคาร"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.size" label="ความจุ" type="number"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.type" label="ประเภท"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                        :items="statusItem"
                        v-model="editedItem.status"
                        item-value="id"
                        item-text="name"
                        label="Status"
                      ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                        :items="activeItem"
                        v-model="editedItem.active"
                        item-value="id"
                        item-text="name"
                        label="active"
                      ></v-select>
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
    <template v-slot:item.status="{ item }">
      {{ statusValue(item.status) }}
    </template>
    <template v-slot:item.active="{ item }">
      {{ activeValue(item.active) }}
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
// import room from "./../mockup/room.json"
import Axios from 'axios'

export default {
    data: () => ({
      dialog: false,
      headers: [
        {
          text: 'ห้อง',
          align: 'start',
          sortable: false,
          value: 'room_id',
        },
        { text: 'อาคาร', value: 'building' },
        { text: 'ความจุ', value: 'size' },
        { text: 'ประเภท', value: 'type' },
        { text: 'status', value: 'status' },
        { text: 'active', value: 'active' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      statusItem: [{id: 0, name: 'Unavailable'}, {id: 1, name:'Available'}],
      activeItem: [{id: 0, name: 'Inactive'}, {id: 1, name: 'Active'}],
      rooms: [],
      editedIndex: -1,
      editedItem: {
      },
      defaultItem: {
        room_id: '',
        building: '',
        size: 0,
        type: '',
        status: 0,
        active: 0,
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
        this.editedItem = this.defaultItem;
        this.fetchRooms();
      },

      async fetchRooms() {
        await Axios.get(this.$mainUrl + "rooms")
          .then((res) => { this.rooms = res.data })
          .catch(err => alert(err));
      },

      statusValue (status) {
        return (status === 1 ? 'Available' : 'Unavailable')
      },

      activeValue (status) {
        return (status === 1 ? 'Active' : 'Inactive')
      },

      editItem (item) {
        this.editedIndex = this.rooms.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      async deleteItem (item) {
        const index = this.rooms.indexOf(item)
        var sure = confirm('Are you sure you want to delete this item?')
        if (sure) {
          await Axios.delete(this.$mainUrl + "rooms/" + this.rooms[index].id)
            .then(() => {
              this.rooms.splice(index, 1)
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
          await Axios.put(this.$mainUrl + "rooms/" + this.rooms[this.editedIndex].id, this.editedItem)
            .then(() => {
              Object.assign(this.rooms[this.editedIndex], this.editedItem)
            })
            .catch(err => alert(err));
        } else {
          await Axios.post(this.$mainUrl + "rooms", this.editedItem)
            .then(() => {
              this.rooms.push(this.editedItem)
            })
            .catch(err => alert(err));
        }
        this.close()
      },
    },
  }
</script>