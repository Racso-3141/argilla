<template>
  <div class="settings__container">
    <div class="settings__edition-form">
      <h2 class="--heading5 --medium">Edit fields</h2>
      <div v-for="field in settings.fields" :key="field.id">
        <form
          @submit.prevent="onSubmit(field)"
          class="settings__edition-form__fields"
        >
          <div class="settings__edition-form__name">
            <h4 class="--body1 --medium --capitalized" v-text="field.name" />
          </div>

          <Validation
            :validations="field.validate().title"
            class="settings__edition-form__group"
          >
            <label for="field.id">Title</label>
            <input type="type" id="field.id" v-model="field.title" />
          </Validation>

          <BaseSwitch v-model="field.settings.use_markdown"
            >Use Markdown</BaseSwitch
          >

          <div class="settings__edition-form__footer">
            <BaseButton
              type="button"
              class="secondary light small"
              @on-click="restore(field)"
              :disabled="!field.isModified"
            >
              <span v-text="'Cancel'" />
            </BaseButton>
            <BaseButton
              type="submit"
              class="primary small"
              :disabled="!field.isModified || !field.isFieldValid"
            >
              <span v-text="'Update'" />
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useSettingsFieldsViewModel } from "./useSettingsFieldsViewModel";

export default {
  name: "SettingsFields",
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onSubmit(field) {
      this.update(field);
    },
  },
  setup() {
    return useSettingsFieldsViewModel();
  },
};
</script>
<style lang="scss" scoped>
.settings {
  &__container {
    display: flex;
    gap: $base-space * 4;
    height: 100%;
    flex-wrap: wrap;
    min-height: 0;
    overflow: auto;
  }

  &__edition-form {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: $base-space * 2;
    max-width: 1000px;
    padding-top: $base-space;

    &__fields {
      display: flex;
      flex-direction: column;
      gap: $base-space * 2;
    }

    &__name {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: $base-space * 2;
      h4 {
        margin: 0;
      }
      p {
        color: $black-54;
      }
    }

    &__group {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: $base-space;

      & label {
        width: fit-content;
        height: 14px;
        color: $black-54;
      }

      & input {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        height: 24px;
        padding: 16px;
        background: palette(white);
        border: 1px solid $black-20;
        border-radius: $border-radius;
        outline: 0;
        &:focus {
          border: 1px solid $primary-color;
        }
      }
    }

    &__footer {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      padding: $base-space * 2 0;
      border-bottom: 1px solid $black-10;
      display: inline-flex;
      gap: $base-space;
    }
  }
}
</style>
