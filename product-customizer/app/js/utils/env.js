class ENV {
  static isLocal() {
    return document.location.hostname === 'localhost' || document.location.hostname === 'pridebites-customizer.dev';
  }

  static production() {
    return !this.isLocal();
  }

  static development() {
    return !!this.isLocal();
  }
}

export default ENV;
