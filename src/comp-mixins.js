import _ from 'lodash';
import Vue from 'vue';

const compBus = new Vue();

const events = {};

export default {
  props: {
    id: {
      type: [String, Number],
      default: +new Date()
    }
  },

  data() {
    return {
      config: {},
      data: null
    };
  },

  created() {
    // this.$store.commit('addCompVueInstance', {
    //   id: this.id,
    //   component: this
    // });
  },

  destroyed() {
    // this.$store.commit('deleteCompVueInstance', this.id);
    this.off(); // 当组件销毁时，移除所有事件监听
    this.destroy();
  },

  methods: {
    init(config) {
      this.mergeConfig(config);
    },
    render(data, config) {
      this.mergeConfig(config);
      this.setData(data);
    },
    // eslint-disable
    resize({width, height}) {},
    clear() {},
    destroy() {},
    updateConfig(config) {
      this.mergeConfig(config);
      this.render(this.data);
    },
    // 此组件监听来自其他组件的事件
    on(compId, eventName, callback) {
      const event = `${compId}:${eventName}`;
      compBus.$on(event, callback);
      (events[event] || (events[event] = [])).push({
        fromId: this.id,
        cb: callback
      });
      return this;
    },
    // 移除监听
    off(compId, eventName, callback) {
      const event = `${compId}:${eventName}`;
      if (!arguments.length) { // 移除此组件对外的所有监听
        Object.keys(events)
        .forEach(event => {
          const cbs = events[event];
          cbs && _.remove(cbs, e => {
            if (e.fromId === this.id) {
              compBus.$off(event, e.cb);
              return true;
            }
          });
        });
      } else if (arguments.length === 1) { // 移除此组件对某个组件的所有事件监听
        Object.keys(events)
        .filter(event => new RegExp(`^${compId}:`).test(event))
        .forEach(event => {
          const cbs = events[event];
          if (cbs && cbs.length) {
            _.remove(cbs, e => {
              if (e.fromId === this.id) {
                compBus.$off(event, e.cb);
                return true;
              }
            });
          }
        });
      } else if (arguments.length === 2) { // 移除此组件对某个组件某个事件的监听
        const cbs = events[event];
        if (cbs && cbs.length) {
          _.remove(cbs, e => {
            if (e.fromId === this.id) {
              compBus.$off(event, e.cb);
              return true;
            }
          });
        }
      } else { // 移除此组件对某个组件某个事件的某个回调的监听
        const cbs = events[event];
        if (cbs && cbs.length) {
          _.remove(cbs, e => {
            if (e.fromId === this.id && e.cb === callback) {
              compBus.$off(event, e.cb);
              return true;
            }
          });
        }
      }
      return this;
    },
    // 抛出事件
    emit(eventName, data) {
      const event = `${this.id}:${eventName}`;
      compBus.$emit(event, data);
      return this;
    },
    // 合并配置
    mergeConfig(config) {
      if (!config) {
        return this.config;
      }
      // this.config.theme = _.defaultsDeep(config.theme || {}, this.config.theme);
      this.config = _.defaultsDeep(config || {}, this.config);
      return this.config;
    },
    // 设置数据
    setData(data) {
      if (data) {
        this.data = data;
      }
      return this.data;
    }
  }
}