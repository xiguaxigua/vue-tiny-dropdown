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
  { label: '1', id: 456 },
  { label: '2', id: 46 },
  { label: '3', id: 56 },
  { label: '1', id: 456 },
  { label: '2', id: 46 },
  { label: '3', id: 56 },
  { label: '1', id: 456 },
  { label: '2', id: 46 },
  { label: '3', id: 56 },
  { label: '1', id: 456 },
  { label: '2', id: 46 },
  { label: '3', id: 56 },
  { label: '4', id: 45 }
]
const DEFAULT_TOTAL = 100

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

<style lang="scss">

</style>
