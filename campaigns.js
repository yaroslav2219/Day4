console.log('campaigns module loaded')
export const campaigns = {
data:function() {
    return {
        parent: "",
        data: {
            items: []   
        },
        loader: 0,
        date: "",
        date2: ""
    }
},
    mounted:function(){
        this.parent = this.$root;

        if(!this.parent.user){
            this.parent.logout();
            return;
        }
        console.log(this.parent.formData);
        this.get();
        this.GetFirstAndLastDate();
    },
   methods: {
    GetFirstAndLastDate: function() {
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var firstDayOfMonth = new Date(year, month, 2);
        var lastDayOfMonth = new Date(year, month + 1, 1);

        this.date = firstDayOfMonth.toISOString().substring(0, 10);
        this.date2 = lastDayOfMonth.toISOString().substring(0, 10);
    },

    togglePublished: function(item, value) {
        item.published = value;

        axios.post(
            this.parent.url + "/site/actionCampaign?auth=" + this.parent.user.auth.data,
            this.parent.toFormData(item)
        ).catch(() => {
            item.published = !value;
        });
    }, // ← обов’язкова кома

    get: function() {
        this.loader = 1;

        axios.post(
            this.parent.url + "/site/getCampaigns?auth=" + this.parent.user.auth.data
        ).then(res => {

            const items = Array.isArray(res.data.items)
                ? res.data.items.filter(i => i && i.id)
                : [];

            this.data.items = items;
            this.loader = 0;
        }).catch(() => {
            this.parent.logout();
        });
    },

    action: function() {
        if (!this.parent.formData.title) return; // перевірка title

        var self = this;
        var data = self.parent.toFormData(self.parent.formData);

        axios.post(this.parent.url + "/site/actionCampaign?auth=" + this.parent.user.auth.data, data)
        .then(function(response){
            self.$refs.new.active = 0;
            if(self.parent.formData.id){
                self.$refs.header.$refs.msg.successFun("Successfully updated campaign!");
            }else{
                self.$refs.header.$refs.msg.successFun("Successfully added new campaign!");
            }
            self.get();
        }).catch(function(error){
            console.log('errors : ', error);
        });
    },

    del: async function() {
        if (!this.parent.formData.id) return;

        if(await this.$refs.header.$refs.msg.confirmFun("Please confirm next action", "Do you want to delete this campaign?")){
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);

            axios.post(this.parent.url + "/site/actionCampaign?auth=" + this.parent.user.auth.data, data)
            .then(function(response){
                if(response.data.error){
                    self.$refs.header.$refs.msg.alertFun(response.data.error);   
                } else {
                    self.$refs.header.$refs.msg.successFun("Successfully deleted campaign!");
                    self.get();
                }
            }).catch(function(error){
                console.log('errors : ', error);
            });
        }
    }
},

    template: `
    <div class="inside-content">
    <Header ref="header" />
    <div id='spinner' v-if="loader"></div>
    <div class="wrapper">
    <div class="flex panel">
    <div class="w20 ptb30">
    <h1>Campaigns</h1>
    </div>
    <div class="w60 ptb20 ac"><input type="date" @change="get()" /> - <input type="date" v-model="date2" @change="get()" />
    <div class="w20 al ptb20">
      <a class="btnS" href="#" @click.prevent="parent.formData={};$refs.new.active=1"><i class="fas fa-plus"></i> New</a>
    </div>
    </div>
    <popup ref="new" :title="(parent.formData && parent.formData.id) ? 'Edit campaign' : 'New Campaign'">
    <div class="form inner-form">
    <form @submit.prevent="action()" v-if="parent.formData">
    <div class="row">
    <label>Name</label>
    <input type="text" v-model="parent.formData.title" required>
    </div>

    <div class="row">
    <button class="btn" v-if="parent.formData && parent.formData.id">Edit</button>
    <button class="btn" v-if="parent.formData && !parent.formData.id">Add</button>
    </div>
    </form>
    </div>
    </popup>
    </div>
    </div>
    
 <div class="table" v-if="data.items.length">
  <table>
    <thead>
      <tr>
        <th class="id">#</th>
        <th class="id"></th>
        <th>Title</th>
        <th class="id">Views</th>
        <th class="id">Clicks</th>
        <th class="id">Leads</th>
        <th class="id">Fraud clicks</th>
        <th class="actions">Actions</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="item in data.items"
        :key="'campaign-' + item.id"
      >
        <td class="id">{{ item.id }}</td>

        <td class="id">
          <toogle
            :modelValue="item.published"
            @update:modelValue="togglePublished(item, $event)"
          />
        </td>

        <td>
          <router-link :to="'/campaign/' + item.id">
            {{ item.title }}
          </router-link>
        </td>

        <td class="id">{{ item.views }}</td>

        <td class="id">{{ item.clicks || 0 }}</td>

        <td class="id">{{ item.leads || 0 }}</td>

        <td class="id">{{ item.fclicks || 0 }}</td>

        <td class="actions">
          <a href="#" @click.prevent="parent.formData = { ...item }; del()">
            <i class="fas fa-trash-alt"></i>
          </a>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<div class="empty" v-else>
  No items
</div>
`};  


















