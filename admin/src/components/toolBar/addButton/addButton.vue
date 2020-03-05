<script>
export default {
  name: "",
  components: {},
  props: {
    option: Function
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  render() {
    return (
      <a-button type="primary" icon="plus" onClick={this.option}>
        添加
      </a-button>
    );
  }
};
</script>
<style scoped></style>
