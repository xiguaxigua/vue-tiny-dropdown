<template>
  <div class="page-demo">
    <tiny-dropdown
      ref="list"
      :selected.sync="selected"
      :data-empty="dataEmpty"
      :total="total"
      :keywords.sync="keywords"
      :options="options"
      position="fixed"
      @close="reset"
      @search="search"
      @load-data="loadData">
      <template scope="scope">
        <span>{{ scope.data.label }}</span>
      </template>
    </tiny-dropdown>
  </div>
</template>

<script>
import TinyDropdown from '../src/tiny-dropdown'

const DEFAULT_OPTIONS = [
  { label: '1', id: 1 },
  { label: '2', id: 2 },
  { label: '3', id: 3 },
  { label: '4', id: 4 },
  { label: '5', id: 5 },
  { label: '6', id: 6 },
  { label: '7', id: 7 },
  { label: '8', id: 8 },
  { label: '9', id: 9 },
  { label: '10', id: 10 },
  { label: '11', id: 11 },
  { label: '13', id: 13 },
  { label: '14', id: 14 },
  { label: '15', id: 15 }
]
const DEFAULT_TOTAL = 40

export default {
  name: 'Demo',

  data () {
    return {
      options: [],
      selected: null,
      dataEmpty: false,
      total: 0,
      page: 1,
      keywords: null
    }
  },

  methods: {
    reset () {
      this.page = 1
      this.options = []
    },

    search () {
      this.reset()
      this.loadData()
    },

    loadData () {
      setTimeout(() => {
        this.options = this.options.concat(DEFAULT_OPTIONS)
        this.total = DEFAULT_TOTAL
        this.dataEmpty = !DEFAULT_OPTIONS
        this.page++
        this.$refs.list.closeLoading()
      }, 1000)
    }
  },

  watch: {
    selected (v) {
      if (v === null) this.reset()
    }
  },

  components: { TinyDropdown }
}
</script>
