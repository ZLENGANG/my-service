<template>
  <div class="container">
    <div id="result"></div>
    <div class="options-container">
      <div
        class="option-btn"
        v-for="item in options"
        :key="item"
        @click="handleOptionClick(item)"
      >
        {{ item }}
      </div>
    </div>
    <div
      class="input-container"
      ref="editorContainerRef"
      :contenteditable="isOutContenteditable"
      @click="handleEditorContainerClick"
    >
      <!-- 这里将动态渲染模板内容 -->
      <template v-for="element in elements" :key="element.type + element.id">
        <span v-if="element.type === 'text'">{{ element.content }}</span>
        <div
          v-else-if="element.type === 'input'"
          class="content-editor"
          :contenteditable="true"
          :placeholder="element.placeholder"
          :data-is-placeholder="`${element.isPlaceholder}`"
          @click="
            (e) => {
              handleInputClick(e, element);
            }
          "
          @blur="handleBlur"
          @keydown="handleKeyDown($event, element)"
        >
          {{ element.displayText }}
        </div>
      </template>
    </div>

    <div class="send-box">
      <div class="cancel-btn">取消</div>
      <div class="option-btn send-btn">发送</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { elements as renderData, dataMap } from "./utils/parse.js";

const elements = ref(renderData);
const options = ref([]);
const isOutContenteditable = ref("true");
const curSelectedId = ref("");
const editorContainerRef = ref();

const handleEditorContainerClick = () => {};

const handleOptionClick = (btnText) => {
  elements.value.forEach((item) => {
    if (item.id === curSelectedId.value) {
      item.displayText = btnText;
    }
  });
};

const handleInputClick = (e, ele) => {
  isOutContenteditable.value = "false";
  options.value = dataMap[ele.id];
  curSelectedId.value = ele.id;
  setTimeout(() => {
    e.target.focus();
  }, 100);
};

const handleBlur = () => {
  isOutContenteditable.value = "true";
};

const handleKeyDown = (e) => {
  if (e.key === "Backspace") {
    if (!e.target.textContent) {
      editorContainerRef.value.removeChild(e.target);
      setTimeout(() => {
        resetCursorPostion();
      }, 200);
    }
  }
};

function resetCursorPostion() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0).cloneRange();
  range.collapse(true); // 折叠到起始位置

  const startContainer = range.startContainer;
  const startOffset = range.startOffset;

  // 分割文本节点并调整选区
  const originalText = startContainer.textContent;
  const beforeText = originalText.slice(0, startOffset);
  const afterText = originalText.slice(startOffset);
  startContainer.textContent = beforeText;
  const newNode = document.createTextNode(afterText);
  startContainer.parentNode.insertBefore(newNode, startContainer.nextSibling);

  // 恢复光标位置
  const newRange = document.createRange();
  newRange.setStart(newNode, 0);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);
}
</script>

<style>
@import url("./index.css");
</style>
