class ValidatorUtil {
  static baseKnobValidation(knob) {
    ValidatorUtil.assertHasProperty(knob, "type");
    ValidatorUtil.assertHasProperty(knob, "displayName");
    ValidatorUtil.assertHasProperty(knob, "reviewName");
    ValidatorUtil.assertHasProperty(knob, "internalName");
    if (knob.containedById) {
      ValidatorUtil.assertHasProperty(knob, "containedBy");
    }
  }

  static assertHasProperty(obj, propertyName) {
    if (!Object.prototype.hasOwnProperty.call(obj, propertyName)) {
      throw new Error(`${Object.entries(obj)} missing ${propertyName}`);
    }
  }

  static validateChoiceSpec(choice) {
    ValidatorUtil.assertHasProperty(choice, "displayValue");
    ValidatorUtil.assertHasProperty(choice, "reviewValue");
    ValidatorUtil.assertHasProperty(choice, "internalValue");
  }
}

export default ValidatorUtil;
