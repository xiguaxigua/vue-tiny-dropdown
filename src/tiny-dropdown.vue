<template>
  <div
    @mouseenter="mouseInState = true"
    @mouseleave="mouseInState = false"
    class="td-tinydropdown">
    <input type="text" ref="hideInput" class="hide-input">
    <el-input
      ref="input"
      @focus="focusHandler"
      @keyup.native="keyupHandler"
      v-model.trim="innerKeywords"
      :size="inputSize">
      <!-- 在此处使用v-show，当隐藏时会导致留下一个 right-side-box  -->
      <i
        class="close-btn"
        v-if="selected"
        @click="clearSelect"
        slot="append">
        X
      </i>
    </el-input>
    <transition name="popper">
      <div
        ref="popper"
        v-show="popperVisible"
        class="td-tinydropdown-list-popper"
        @mouseenter="mouseInState = true"
        @mouseleave="mouseInState = false"
        :style="popperStyle">
        <loading v-show="popperLoading"></loading>
        <ul
          @scroll="popperScrollHandler"
          @click="listClickHandler"
          ref="popperContainer"
          class="popper-container">
          <li
            v-for="(option, index) in innerOptions"
            :style="popperItemStyle"
            class="popper-item popper-item-li-check"
            :class="{ 'is-selected': selected && option.id === selected.id }"
            :data-index="index"
            :key="index">
            <slot :data="option"></slot>
          </li>
          <li
            v-show="showLoadingItem"
            class="popper-loading show-center"
            :style="popperItemStyle">
            <span v-show="!loadEnd">加载中...</span>
            <span v-show="loadEnd">加载完毕</span>
          </li>
          <li
            v-show="dataEmpty"
            class='list-data-empty show-center'
            :style="emptyStyle">
            暂无数据
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import debounce from 'lodash-es/debounce'
import throttle from 'lodash-es/throttle'
import Loading from './components/loading'

import ElInput from 'element-ui/packages/input/src/input.vue'
import 'element-ui/lib/theme-default/input.css'

const DEBOUNCE_TIME = 500
const THROTTLE_TIME = 50

export default {
  name: 'TinyDropdown',

  props: {
    inputSize: { type: String, default: 'small' },
    popperWidth: { type: Number },
    popperHeight: { type: Number, default: 300 },
    options: { type: Array, required: true },
    popperItemHeight: { type: Number, default: 30 },
    selected: Object,
    dataEmpty: Boolean,
    keywords: { type: [String, Number], default: '' },
    total: { type: Number, default: 0 },
    position: { type: String, default: 'absolute' }
  },

  data () {
    this.domAppended = false
    this.loader = {}

    return {
      popperPosition: {
        left: 0,
        top: 0
      },
      bottomLoading: false,
      mouseInState: false,
      popperVisible: false,
      inputWidth: '',
      innerOptions: [],
      popperLoading: false
    }
  },

  computed: {
    popperStyle () {
      let left = this.popperPosition.left
      if (this.position === 'absolute') {
        left += window.pageXOffset
      }
      return {
        width: this.innerPopperWidth,
        height: `${this.popperHeight}px`,
        left: `${left}px`,
        top: `${this.popperPosition.top}px`,
        position: this.position
      }
    },

    innerPopperWidth () {
      return this.popperWidth ? `${this.popperWidth}px` : this.inputWidth
    },

    popperItemStyle () {
      return {
        height: `${this.popperItemHeight}px`
      }
    },

    innerSelected: {
      get () { return this.selected },
      set (v) { this.$emit('update:selected', v) }
    },

    innerKeywords: {
      get () { return this.keywords },
      set (v) { this.$emit('update:keywords', v) }
    },

    showLoadingItem () {
      return this.popperHeight < this.popperItemHeight * this.innerOptions.length
    },

    loadEnd () {
      return !this.dataEmpty && this.total <= this.innerOptions.length
    },

    emptyStyle () {
      return {
        height: `${this.popperHeight}px`
      }
    }
  },

  methods: {
    init () {
      const input = this.$refs.input.$el
      const position = input.getBoundingClientRect()
      this.popperPosition = {
        left: position.left,
        top: position.top + position.height
      }
      this.inputWidth = `${position.width}px`
    },

    windowClickHandler () {
      if (!this.mouseInState) this.reset()
    },

    reset () {
      this.popperVisible = false
      this.innerKeywords = this.selected ? this.selected.id : ''
      this.$refs.hideInput.focus()
    },

    clearSelect () {
      this.innerSelected = null
      this.innerKeywords = ''
      // 待搜索内容传回至父组件后触发搜索
      this.$nextTick(() => { this.$emit('search') })
    },

    focusHandler () {
      if (!this.domAppended) {
        document.body.appendChild(this.$refs.popper)
        this.domAppended = true
      }
      this.init()
      this.popperVisible = true
      if (!this.innerOptions.length && !this.dataEmpty) {
        this.$emit('load-data')
        this.popperLoading = true
      }
    },

    listClickHandler (e) {
      let target = e.target
      while (!target.classList.contains('popper-item-li-check')) {
        target = target.parentNode
      }
      if (target.classList.contains('is-selected')) return
      let targetIndex = target.dataset.index
      this.innerSelected = this.options[targetIndex]
      this.popperVisible = false
      this.innerKeywords = this.options[targetIndex].id
    },

    keyupHandler: debounce(function () {
      if (this.selected) this.innerSelected = null
      this.$emit('search')
      this.popperLoading = true
    }, DEBOUNCE_TIME),

    closeLoading () {
      this.popperLoading = false
    },

    popperScrollHandler: throttle(function () {
      const popper = this.$refs.popperContainer
      const scrollRemain = popper.scrollHeight - popper.scrollTop
      const loadThreshold = this.popperHeight + 2 * this.popperItemHeight
      if (scrollRemain <= loadThreshold &&
        !this.bottomLoading &&
        this.options.length &&
        !this.loadEnd) {
        this.bottomLoading = true
        this.$emit('load-data')
      }
    }, THROTTLE_TIME)
  },

  watch: {
    options: {
      immediate: true,
      handler (v) {
        this.bottomLoading = false
        this.innerOptions = v
      }
    },

    popperVisible (v) {
      if (!v) {
        this.innerOptions = []
        this.$emit('close')
      }
    }
  },

  mounted () {
    this.init()
    window.addEventListener('click', this.windowClickHandler)
    if (this.position === 'fixed') {
      window.addEventListener('resize', this.reset)
      window.addEventListener('scroll', this.reset)
    }
  },

  beforeDestroy () {
    window.removeEventListener('click', this.windowClickHandler)
    if (this.position === 'fixed') {
      window.removeEventListener('resize', this.reset)
      window.removeEventListener('scroll', this.reset)
    }
    if (this.domAppended) {
      document.body.removeChild(this.$refs.popper)
      this.domAppended = false
    }
  },

  components: { ElInput, Loading }
}
</script>

<style lang="scss">
.td-tinydropdown {
  display: inline-block;
  width: 200px;
  position: relative;

  .hide-input {
    width: 0;
    height: 0;
    border: 0;
    padding: 0;
    position: absolute;
    z-index: -1;
  }

  .close-btn {
    cursor: pointer;

    font-style: normal;
  }
}

.td-tinydropdown-list-popper {
  overflow: hidden;
  border: 1px solid #d1dbe5;
  border-radius: 2px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  transform-origin: center top 0px;
  transition: transform .2s;
  z-index: 4000;

  .show-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  &.popper-enter-active, &.popper-leave-active {
    transform: scaleY(1);
  }

  &.popper-enter, &.popper-leave-to {
    transform: scaleY(0)
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    height: 100%;
    overflow: auto;

    .list-data-empty {
      color: #ccc;
    }

    .popper-item {
      cursor: pointer;
      transition: background-color .5s;

      &.is-selected {
        cursor: not-allowed;
        background-color: #20a0ff;
        color: #fff;
      }

      &.is-selected:hover {
        background-color: #1c8de0;
      }

      &:hover {
        background-color: #e4e8f1;
      }

      &:not(:last-child) {
        border-bottom: 1px solid #ccc;
      }
    }

    .popper-loading {
      color: #ccc;
      font-size: 14px;
    }
  }
}
</style>
