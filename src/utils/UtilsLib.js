export function formatDate(date){

    var newDate = new Date(date);

    return new Intl.DateTimeFormat('en-GB').format(newDate)
  }
