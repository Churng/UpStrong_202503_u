if (window.consoleToggle) {
  var console = {};
  console.log = function () { };
} else {
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  console = iframe.contentWindow.console;
  window.console = console;
}
(function () {
  class UserDetailApi {

    constructor() {
      console.log('UserDetailApi constructor');
      let session_id = sessionStorage.getItem('sessionId');
      let userType = sessionStorage.getItem('userType');
      let action = 'select'; // select:取得教練資料
      console.log("session_id: ", session_id, 'userType', userType);
      if (userType === "1") {
        userDetailAPI(session_id, action); // 初始化時進行用戶類型的API
      } else if (userType === "2") {
        coachDetailAPI(session_id, action); // 初始化時進行教練類型的API
      } else if (session_id == null || session_id == undefined) { // 無值時需重新登入
        window.location.assign(
          "../LoginPage/index.html"
        );
      }
    }

  } // end class

  new UserDetailApi();
})();


// 取得/修改 個案資料
function userDetailAPI(session_id, action) {
  const formData = new FormData(); // 存最後要上傳到後端的整包資料 

  // 處理chsm業務邏輯
  let chsm = 'upStrongUserDetailApi'; // api文件相關
  if (action === 'insert') {
    chsm = $.md5(action + chsm);
  } else if (action === 'select') {
    chsm = $.md5(session_id + action + chsm);
    console.log("select chsm: ", chsm);
  } else if (action === 'update') {
    chsm = $.md5(session_id + action + chsm);
  } else {
    // 其他例外
  }

  // 處理formData整包資料
  formData.append('session_id', session_id);
  formData.append('action', action);
  formData.append('chsm', chsm);

  $.ajax({
    url: `${window.apiUrl}${window.apiuserDetail}`,
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (res) {
      console.log("UserDetailAPI", res);

      const resCode = res.returnCode;
      const resMessage = res.returnMessage;
      const resData = res.returnData;

      if (resCode !== "1") {
        // alert(resMessage);
        new CustomAlert({ content: resMessage });
        // session_id 過期時需重新登入
        window.location.assign(
          "../LoginPage/index.html"
        );
      } else {
        // save sesseionId
        console.log('User Select Data SUCCESS');

        if (action === 'select') {
          setUserFormData(resData[0]); // 把取得的資料寫回頁面  
        } else if (action === 'update') {
          //
        } else {
          //
        }
      }
    },
    error: function () {
      $("#error").text("An error occurred. Please try again later.");
    },
  });
}

// 設置 下拉式單選、複選單勾選項目與內容
function setCheckboxData(checkboxName, inputIdPrefix, choice, description, containerIdPrefix) {
  let count = 0;
  let checkboxValues = JSON.parse(choice);
  console.log(checkboxName)
  if (typeof choice === 'string' && !Array.isArray(checkboxValues)) {
    count = 1;  // 單選，數量是1
  } else if (Array.isArray(checkboxValues)) {
    // console.log('This is a multiple choice');
    checkboxValues.length === 0 ? count = checkboxValues.length + 2 : count = checkboxValues.length + 1 // 多選，數量是陣列的長度
  } else {
    console.log('Unknown type 不知是單選還是多選，可能資料型態有例外');
    return;
  }

  // 單選的判斷
  if (count === 1) {
    // 如果是單選（下拉選單），設置選擇的項目
    let selectElement = document.querySelector(`select[name="${checkboxName}"]`);
    if (selectElement) {
      selectElement.value = choice;
    }
    
    if (description != '' && description != {}) {
      let inputId = `${inputIdPrefix}`;
      let containerId = `${containerIdPrefix}_1`;
      let inputElement = document.getElementById(inputId);
      let containerElement = document.getElementById(containerId);
      // 確認容器存在，並給予數值
      if (inputElement) {
        inputElement.value = description;
      }

      // 確認容器存在，並顯示
      if (containerElement) {
        containerElement.style.display = 'block';
      }
    }

    return; // 結束單選判斷
  } else { // 多選並且為checkbox
    // 將 choice 從 JSON 格式解析回數組，並設置為已選中
    let checkboxValues = JSON.parse(choice);
    // console.log('choice', choice);
    // console.log('checkboxValues', checkboxValues);
    checkboxValues.forEach(value => {
      let checkbox = document.querySelector(`input[name="${checkboxName}"][value="${value}"]`);
      if (checkbox) {
        checkbox.checked = true;
      }
    });
  }

  // 設置對應的多選並且為 checkbox 有 input 欄位的值
  let descriptionValues = JSON.parse(description);
  // console.log('descriptionValues:' , descriptionValues);

  // 變數用來計數，代表第幾個容器
  let containerIndex = 1;
  for (const [key, value] of Object.entries(descriptionValues)) {
    let inputId = `${inputIdPrefix}_${key}`;
    let containerId = `${containerIdPrefix}_${containerIndex}`;

    let inputElement = document.getElementById(inputId);
    let containerElement = document.getElementById(inputId) ? document.getElementById(inputId).closest('div') : null;

    // 確認容器存在，並給予數值
    if (inputElement) {
      if (value == '') return; // 如果沒內容則不顯示容器

      inputElement.value = value;
    }

    // 確認容器存在，並顯示
    if (containerElement) {
      containerElement.style.display = 'block';
    }

    // 容器計數器增加
    containerIndex++;
  }
}

// 依據檔案名稱，下載對應檔案的API，若成功可直接下載檔案。
window.getFileAPI = function (fileName, callback) {
  let session_id = sessionStorage.getItem('sessionId');
  let chsm = 'upStrongGetFileApi'; // api文件相關

  chsm = $.md5(session_id + fileName + chsm);
  console.log('session_id', session_id, 'fileName', fileName, 'chsm', chsm);

  const apiUrl = `${window.apiUrl}${window.apigetFile}`;

  const xhr = new XMLHttpRequest();
  xhr.open('POST', apiUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.responseType = 'blob';
  xhr.onload = function (e) {
    if (this.status === 200 && callback) {
      console.log('callback(url)', callback);
      const blob = new Blob([this.response], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      return callback(url);
    }

    if (this.status === 200) {
      const blob = new Blob([this.response], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName; // 下載後的文件名
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // 移除臨時創建的<a>標籤
      URL.revokeObjectURL(url); // 釋放URL   
    }
  };
  xhr.send(`session_id=${session_id}&fileName=${fileName}&chsm=${chsm}`);
}

// 把取得的個案資料映射回頁面
function setUserFormData(resData) {

console.log('resData from api',resData)
  // ###個案基本資料###
  $("#userName").val(resData.userName);                               // 個案名稱hidden on summit
  $("#userNickName").val(resData.userNickName);                       // 個案喜歡的稱呼
  $("#showUserIdNumber").val(resData.idNumber);                       // 帳號 (身分證字號) show on page
  $("#userIdNumber").val(resData.idNumber);                           // 帳號 (身分證字號) hidden on summit
  $("#userPassword").val(resData.password);                           // 密碼
  $("#sex").val(resData.sex);                                         // 個案性別
  $("#birthDate").val(resData.birthDate);                             // 出生日期 hidden on summit
  $("#height").val(resData.height);                                   // 身高 (cm)
  $("#weight").val(resData.weight);                                   // 體重 (kg)
  setCheckboxData('livingEnvironmentChoice', 'livingEnvironmentDescription', resData.livingEnvironmentChoice, resData.livingEnvironmentDescription
    , 'livingEnvironmentDescriptionContainer');                       // 居住環境(單選)
  $twzipcode = $("#twzipcode");
  $("#twzipcode").twzipcode();                                     // 居住縣市
  let standardizedCounty = resData.county.replace('台', '臺');
  $twzipcode.twzipcode("set", { county: standardizedCounty, district: resData.district });
  $("#userAddress").val(resData.address);                             // 地址
  setCheckboxData('residentChoice', 'residentDescription', resData.residentChoice, resData.residentDescription
    , 'residentDescriptionContainer');                                // 個案目前的同住者(複選)
  $('#mainCaregiverName').val(resData.mainCaregiverName);             // 主要照顧者姓名
  setCheckboxData('mainCaregiverRelationChoice', 'mainCaregiverRelationDescription', resData.mainCaregiverRelationChoice, resData.mainCaregiverRelationDescription
    , 'mainCaregiverRelationDescriptionContainer');                   // 主要照顧者與個案關係(單選)
  $('#mainCaregiverPhone').val(resData.mainCaregiverPhone);           // 主要照顧者手機

  // ###個案狀況與喜好###
  setCheckboxData('phraseChoice', 'phraseDescription', resData.phraseChoice, resData.phraseDescription
    , 'phraseDescriptionContainer');                                  // 慣用語(單選)
  $('#careerBackground').val(resData.careerBackground);               // 過往職業背景
  $('#hobby').val(resData.hobby);                                     // 特別喜歡、重視的事物、音樂
  $('#symptom').val(resData.symptom);                                 // 個案症狀
  setCheckboxData('medicalSiagnosisChoice', 'medicalSiagnosisDescription', resData.medicalSiagnosisChoice, resData.medicalSiagnosisDescription
    , 'medicalSiagnosisDescriptionContainer');                        // 醫療診斷(複選)
  $(`#disability${resData.disabilityLevel}`).attr("checked", true);
  $(`#cms${(resData.longTermCareCMS)}`).attr("checked", true);


    const medicalCaseHistoryArray = JSON.parse(resData.medicalCaseHistory);//醫療史
    medicalCaseHistoryArray.forEach((item) => {
        $(`#medicalCaseHistory${item}`).attr("checked", true);
    });


  $('#classificationChoice').val(resData.classificationChoice);       // 功能分級(單選)
  $('#physicalMobility').val(resData.physicalMobility);               // 身體行動能力
  setCheckboxData('assistiveDevicesChoice', 'assistiveDevicesDescription', resData.assistiveDevicesChoice, resData.assistiveDevicesDescription
    , 'assistiveDevicesDescriptionContainer_1');                        // 目前正在使用的輔具(複選)
  setCheckboxData('isReceivedTrainChoice', 'isReceivedTrainDescription', resData.isReceivedTrainChoice, resData.isReceivedTrainDescription
    , 'isReceivedTrainDescriptionContainer');                         // 個案目前是否有接受復能訓練(單選)
  setCheckboxData('facingDifficultyChoice', 'facingDifficultyDescription', resData.facingDifficultyChoice, resData.facingDifficultyDescription
    , 'facingDifficultyDescriptionContainer');                        // 生活上面臨哪些困難(複選) 
  $('#aboveStatusTime').val(resData.aboveStatusTime);                 // 以上狀態發生至今維持多久
  $('#lifeSatisfaction').val(resData.lifeSatisfaction);               // 對目前生活的滿意度
  $('#familySupportChoice').val(resData.familySupportChoice);         // 家庭支持度(單選)
  $('#trainAmbitionChoice').val(resData.trainAmbitionChoice);         // 個案參與復能訓練的企圖心(單選)
  $('#threeMonthGoal').val(resData.threeMonthGoal);                   // 請個案描述未來三個月想達成的目標
  $('#mostWantToDo').val(resData.mostWantToDo);                       // 個案恢復生活自理後，最想做的事是什麼

  // ###聯絡人資料###
  $('#contactName').val(resData.contactName);                         // 聯絡人名稱
  $('#relationship').val(resData.relationship);                       // 與個案關係(單選)
  $('#contactPhoneNumber').val(resData.contactPhoneNumber);           // 聯絡人手機
  $('#contactEmail').val(resData.contactEmail);                       // Email
  $('#contactLineId').val(resData.contactLineId);                     // 聯絡人 LINE ID
  $('#suitContactTime').val(resData.suitContactTime);                 // 適合聯絡您的時間
  $('#suitEvaluateTime').val(resData.suitEvaluateTime);               // 請留下三個方便評估個案的時段 

  // ###檔案資料###
  const fileUploadInstance = FileUpload.getInstance();
  fileUploadInstance.populateFromAPI(JSON.parse(resData.file));       // 上傳檔案

  // ###發票###
  $('#invoiceType').val(resData.invoiceType);                         // 發票種類
  if (resData.invoiceType === "2") { // 二聯式
    // console.log('invoiceType:2', invoiceType);
    $('#sendToEmail').prop('checked', resData.sendToEmail === "1");
    $('#useElectronicCarrier').prop('checked', resData.useElectronicCarrier === "1");
    $('#phoneCarrierNumber').val(resData.phoneCarrierNumber);         // 手機載具號碼
  } else if (resData.invoiceType === "3") { // 三聯式
    $('#invoiceTitle').val(resData.invoiceTitle);                     // 受買人抬頭
    $('#taxID').val(resData.taxID);                                   // 受買人統編
  }
  listenInvoiceType(resData.invoiceType); // 發票種類 資料設置完成後，需把畫面上的顯示相對應內容以符合需要
}

// 取得/修改 教練資料
function coachDetailAPI(session_id, action) {
  const formData = new FormData(); // 存最後要上傳到後端的整包資料 

  // 處理chsm業務邏輯
  let chsm = 'upStrongCoachDetailApi'; // api文件相關
  if (action === 'insert') {
    chsm = $.md5(action + chsm);
  } else if (action === 'select') {
    chsm = $.md5(session_id + action + chsm);
    console.log("coach select chsm: ", chsm);
  } else if (action === 'update') {
    chsm = $.md5(session_id + action + chsm);
  } else {
    // 其他例外
  }

  // 處理formData整包資料
  formData.append('session_id', session_id);
  formData.append('action', action);
  formData.append('chsm', chsm);

  // console.log("取得個案檔案", "files", files);
  // console.log("取得個案資料", "jsonData", jsonData);

  $.ajax({
    url: `${window.apiUrl}${window.apicoachDetail}`,
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (res) {
      console.log("coachDetailAPI", res);

      const resCode = res.returnCode;
      const resMessage = res.returnMessage;
      const resData = res.returnData;

      if (resCode !== "1") {
        // alert(resMessage);
        new CustomAlert({ content: resMessage });
        // session_id 過期時需重新登入
        window.location.assign(
          "../LoginPage/index.html"
        );
      } else {
        // save sesseionId
        console.log('Coach Select Data SUCCESS');
        console.log(resData[0]);

        if (action === 'select') {
          setCoachFormData(resData[0]); // 把取得的資料寫回頁面  
        } else if (action === 'update') {
          //
        } else {
          //
        }
      }
    },
    error: function () {
      $("#error").text("An error occurred. Please try again later.");
    },
  });
}

// 把取得的教練資料映射回頁面
function setCoachFormData(resData) {
  // ###教練基本資料###
  $("#coachType").val(resData.coachType);                             // 教練類別 1:專業評估教練 2:自主應用教練  
  setServiceArea(resData.coachType, resData.serviceArea, resData.serviceBase); // 設置服務據點 依據coachType= 1:服務區域、2:服務據點 

  $("#coachName").val(resData.coachName);                             // 教練名稱
  $("#phoneNumber").val(resData.phoneNumber);                         // 教練手機
  $("#coachIdNumber").val(resData.idNumber);                          // 帳號(身分證字號)
  $("#showCoachIdNumber").val(resData.idNumber);                      // 帳號(身分證字號)
  $("#coachPassword").val(resData.password);                          // 密碼
  $("#email").val(resData.email);                                     // Email
  $("#lineId").val(resData.lineId);                                     // Email
  $("#residenceAddress").val(resData.residenceAddress);               // 戶籍地址
  $("#mailingAddress").val(resData.mailingAddress);                   // 通訊地址

  // ###服務資訊###               
  const expertiseInstance = Expertise.getInstance();                   // 專長簡歷 V 已完成 
  expertiseInstance.populateInitialData(JSON.parse(resData.expertise));// 專長簡歷 V 已完成 

  let imagePhotoURL = resData.imagePhoto;
  let imagePhotoName = resData.imagePhotoName;
  const uploadAvatarInstance = UploadAvatar.getInstance();             // 形象照片
  uploadAvatarInstance.updateFromAPI(imagePhotoURL, imagePhotoName);   // 形象照片

  let smallPhotoURL = resData.smallPhoto;
  let smallPhotoName = resData.smallPhotoName;
  const uploadThumbnailInstance = UploadThumbnail.getInstance();             // 頭像小照片
  uploadThumbnailInstance.updateFromAPI(smallPhotoURL, smallPhotoName);   // 頭像小照片 

  // ###後台備註資料###
  $("#selfIntroduction").val(resData.selfIntroduction);              // 自我介紹 (限 200 字)
  $("#remarks").val(resData.remarks);                                // 特殊備註 (限 200 字) 

  const licenseData = JSON.parse(resData.license);
  const licenseInstance = License.getInstance();
  licenseInstance.setLicenseData(licenseData);                       // 上傳證照(僅內部資格審核使用，上限五筆) 
}

// 設置服務據點
function setServiceArea(coachType, serviceArea, serviceBase) {
  // 取得HTML中的選單元素
  let $serviceAreaSelect = $("#selectServiceArea");
  let $serviceBaseSelect = $("#selectServiceBase");

  serviceArea = JSON.parse(serviceArea);
  serviceBase = JSON.parse(serviceBase);

  console.log('coachType', coachType);
  if (coachType === '1') {
    // 標記相應的選項 serviceArea
    for (let area in serviceArea) {
      serviceArea[area].forEach(function (subArea) {
        let optionValue = area + "_" + subArea;
        $serviceAreaSelect.find(`option[value='${optionValue}']`).prop('selected', true);
      });
    }
  } else {
    // 標記相應的選項 (Service Base)
    serviceBase.forEach(function (base) {
      // console.log('serviceBase', serviceBase);
      $serviceBaseSelect.find(`option[value='${base}']`).prop('selected', true);
    });
  }

  // 使用 Bootstrap Selectpicker，需要手動刷新選單
  $serviceAreaSelect.selectpicker('refresh');
  handleSelectServiceAreaChange($serviceAreaSelect);

  $serviceBaseSelect.selectpicker('refresh');
  handleSelectServiceBaseChange($serviceBaseSelect);

  console.log('updateServiceNameByType coachType', coachType);
  updateServiceNameByType(coachType); // 初始化頁面時，更新服務類型與顯示對應的文字區塊
}

// 依據coachType 更新 #serviceName 的内容
function updateServiceNameByType(coachType) {
  if (coachType === "1") {
    $("#coachType").val(coachType);
    $("#serviceArea").show();
    $("#serviceBase").hide();

    $("#serviceName").text("服務區域");

    $("#serviceAreaText").show();
    $("#serviceBaseText").hide();
  } else if (coachType === "2") {
    $("#coachType").val(coachType);
    $("#serviceArea").hide();
    $("#serviceBase").show();

    $("#serviceName").text("服務據點");

    $("#serviceAreaText").hide();
    $("#serviceBaseText").show();
  }
} 