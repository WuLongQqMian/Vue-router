<template>
  <div class="home-container">
    <!-- Navbar -->
    <van-nav-bar title="黑马头条" fixed />
    <van-pull-refresh v-model="refreshing" :disabled="finished" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <ArticleInfo v-for="item in artlist" :key="item.id" :title="item.title" :author="item.aut_name" :cmt-count="item.comm_count" :time="item.pubdate" :cover="item.cover"></ArticleInfo>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleListAPI } from '@/api/articleAPI.js'

import ArticleInfo from '@/components/Article/ArticleInfo.vue'
import _ from 'lodash'
let fn = null

export default {
  name: 'Home',
  data() {
    return {
      page: 1,
      limit: 10,
      artlist: [],
      // 下一页数据是否正在加载
      loading: true,
      // 所有数据是否加载完毕
      finished: false,
      refreshing: false
    }
  },
  created() {
    this.initArticleList()
  },
  activated() {
    fn = this.recordTopHandler()
    window.addEventListener('scroll', fn)
  },
  deactivated() {
    window.removeEventListener(fn)
  },
  methods: {
    async initArticleList(isRefresh) {
      const { data: res } = await getArticleListAPI(this.page, this.limit)
      if (isRefresh) {
        this.artlist = [...res, ...this.artlist]
        this.refreshing = false
      } else {
        this.artlist = [...this.artlist, ...res]
        this.loading = false
      }
      if (res.length === 0) {
        this.finished = true
        this.page--
      }
    },
    onLoad() {
      this.page++
      this.initArticleList()
    },
    onRefresh() {
      this.page++
      this.initArticleList(true)
    },
    recordTopHandler() {
      return _.debounce(
        () => {
          this.$route.meta.top = window.scrollY
        },
        50,
        { trailing: true }
      )
    }
  },
  components: {
    ArticleInfo
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding: 46px 0 50px;
  // .van-nav-bar {
  //   background-color: blue;
  // }
  // /deep/ .van-nav-bar__title {
  //   color: white;
  // }
}
</style>
