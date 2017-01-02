import React from 'react';
import DesignOption from './design-option';
import HelpText from './help-text';
import ActionCreators from '../actions/action-creators';
import LayerOptionsStore from '../stores/layer-options-store';

class DesignStep extends React.Component {
  constructor(props) {
    super();
    this.state = { current: this.isCurrentStep(props.index) };
  }

  componentDidMount() {
    LayerOptionsStore.addChangeListener(() => {
      this.setState({ current: this.isCurrentStep(this.props.index) }, () => {
        this.animateCurrentStep();
      });
    });

    this.animateCurrentStep();
  }

  isCurrentStep(index) {
    return LayerOptionsStore.getLayerValue('currentStep') === index;
  }

  stepComponents() {
    let index = 1;
    let components = [];

    this.props.step.customizations.forEach(customization => {
      if (this.props.simple && !customization.simple) {
        return;
      }

      components.push(<DesignOption product={this.props.product} simple={this.props.simple} option={customization} key={index} />);
      index++;
    });

    return components;
  }

  setAsCurrentStep(e) {
    ActionCreators.updateLayerOption('currentStep', this.props.index);
    e.preventDefault();
  }

  goToNextStep(e) {
    ActionCreators.updateLayerOption('currentStep', this.props.index + 1);
    e.preventDefault();
  }

  animateCurrentStep() {
    $('.pbc-design-step:not(.current) .pbc-design-step-content').stop().slideUp();
    $('.pbc-design-step.current .pbc-design-step-content').stop().slideDown();
  }

  nextStepLink() {
    if (this.props.last) return <div/>;

    return (
      <a className="pbc-next-step-link" href="" onClick={this.goToNextStep.bind(this)}>
        Take me to the next step &gt;
      </a>
    );
  }

  render() {
    let currentStep = LayerOptionsStore.getLayerValue('currentStep');
    let classes = `pbc-design-step step-${this.props.step.name.toLowerCase()}`;

    if (this.state.current || !currentStep && this.props.index === 1) {
      classes += ' current';
    }

    return (
      <div className={classes}>
        <h2 onClick={this.setAsCurrentStep.bind(this)}>
          {`${this.props.index}. ${this.props.step.title}`}
          <span className="pbc-design-step-plus">&#43;</span>
        </h2>
        <div className="pbc-design-step-content">
          {this.stepComponents()}
          <HelpText product={this.props.product} simple={this.props.simple} option={this.props.step} />
          {this.nextStepLink()}
        </div>
      </div>
    );
  }
}

export default DesignStep;
