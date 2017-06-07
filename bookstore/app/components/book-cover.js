import Ember from 'ember';

export default Ember.Component.extend({

  actions: {

    open() {
      this.set('isShowingModal', true);
      this.get('blurBackground')(true);
    },

    close() {
      this.set('isShowingModal', false);
      this.get('blurBackground')(false);
    }
  }

});
