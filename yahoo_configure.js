Template.configureLoginServiceDialogForYahoo.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl();
  }
});

Template.configureLoginServiceDialogForYahoo.fields = function () {
  return [
    {property: 'clientId', label: 'Client ID'},
    {property: 'secret', label: 'Client secret'}
  ];
};
