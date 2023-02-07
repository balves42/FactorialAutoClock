import moment from "moment";

export default async function amIOnVacation() {
  
  let today = moment().format("DD/MM/YYYY");
  return getVacationList().includes(today) || getHolidayList().includes(today);
}

function getVacationList() {
  return [
    "02/01/2023"
  ];
}

function getHolidayList() {
  return [
    "01/01/2023",
    "07/04/2023",
    "09/04/2023",
    "10/04/2023",
    "25/04/2023",
    "01/05/2023",
    "08/06/2023",
    "10/06/2023",
    "15/08/2023",
    "05/10/2023",
    "01/11/2023",
    "01/12/2023",
    "08/12/2023",
    "25/12/2023"
  ];
}
