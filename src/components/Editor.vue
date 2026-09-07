<script setup>
import tinymce from 'tinymce';
import Editor from '@tinymce/tinymce-vue';
import { ref, watch } from 'vue';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/template';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';
import ChooseImage from '@/components/ChooseImage.vue';

// v-model 定義
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const ChooseImageRef = ref(null);

const emit = defineEmits(['update:modelValue']);

// TinyMCE 5 配置
const init = {
  language_url: '/tinymce/langs/zh_TW.js',
  language: 'zh_TW',
  skin_url: '/tinymce/skins/ui/oxide',
  content_css: '/tinymce/skins/content/default/content.min.css',
  menubar: false,
  autoresize_bottom_margin: 50,
  max_height: 500,
  min_height: 400,
  toolbar_mode: 'sliding',
  plugins:
    'wordcount visualchars visualblocks template searchreplace save quickbars preview pagebreak nonbreaking media insertdatetime importcss image help fullscreen directionality codesample code charmap link table lists advlist anchor autolink autoresize autosave emoticons',
  toolbar:
    'undo redo | fontsizeselect fontselect | formats | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | table link imageUpload media template | removeformat fullscreen help ',
  content_style: 'p { margin: 5px 0; font-size: 14px; }',
  fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
  font_formats:
    '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
  // 自訂模板列表
  templates: [
    { title: '自訂範本 1', description: '範本描述文字', content: '<p>這是插入的範本內容</p>' },
    { title: '商品詳情表格', description: '插入規格表', content: '<table border="1"><tr><td>規格</td><td>說明</td></tr></table>' }
  ],
  branding: false,
  elementpath: false,
  resize: false,
  statusbar: false,
  setup: (editor) => {
    editor.ui.registry.addButton("imageUpload",{
      tooltip: "上傳圖片",
      icon: "image",
      onAction: () => {
        ChooseImageRef.value.openHandler((data)=>{
          data.forEach(url =>{
            editor.insertContent(`<img src="${url}" alt="圖片" />`);
          })
        });
      }
    })
  }
};

// 雙向綁定處理
const content = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== content.value) {
      content.value = newVal;
    }
  }
);

watch(content, (newVal) => {
  emit('update:modelValue', newVal);
});
</script>

<template>
  <editor v-model="content" tag-name="div" :init="init" />
  <ChooseImage :preview="false" ref="ChooseImageRef" :limit="9" />
</template>

<style>
.tox-tinymce-aux {
  z-index: 9999 !important;
}
</style>