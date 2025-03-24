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
$(document).ready(function () {

  $(".area-select").selectpicker();
  $(".base-select").selectpicker();
  $(".top-btn").on('click', function () {
    window.scrollTo(0, 0);
  })

  // 監聽 發票種類
  $("select[id=invoiceType]").change(function () {
    listenInvoiceType(this.value);
  });

  // 指定密碼顯示的id
  initTogglePassword("user_togglePassword", "userPassword");
  initTogglePassword("coach_togglePassword", "coachPassword");

  const sendToEmailRadio = $("#sendToEmail");
  const useElectronicCarrierRadio = $("#useElectronicCarrier");
  const phoneCarrierNumberText = $("#invoiceContent");

  // 函數: 寄送到 Email 的相應操作
  function sendToEmailAction() {
    // phoneCarrierNumberText.text("Email地址"); // 2023/07/11 修改拿掉，讓手機載具號碼不變動
    useElectronicCarrierRadio.prop("checked", false);
  }

  // 函數: 使用電子載具的相應操作
  function useElectronicCarrierAction() {
    // phoneCarrierNumberText.text("手機載具號碼"); // 2023/07/11 修改拿掉，讓手機載具號碼不變動
    sendToEmailRadio.prop("checked", false);
  }

  // 函數: 單選、複選選單之操作判斷
  function handleOptionsChange(selectIds, containerIds, inputIds, optionValues) {
    //  console.log('selectId:',selectIds, '\n containerId:', containerIds, '\n inputId:', inputIds, '\n optionValues:', optionValues);
    // console.log(selectIds.length);

    selectIds.forEach(function (selectId, index) {
      let containerId = containerIds[index];
      let inputId = inputIds[index];

      let container = document.getElementById(containerId);
      let input = document.getElementById(inputId);
      let select = document.getElementById(selectId);

      if (!select || !container || !input) {
        return;
      }

      select.addEventListener('change', function () {
        if (select.type === 'checkbox') { // 判斷單選、複選
          // console.log('select.type', 'checkbox'); 
          if (optionValues[index] === this.value) {
            container.style.display = this.checked ? 'block' : 'none';
            input.required = this.checked;
            if (!this.checked) {
              input.value = ''; // 清空输入框的值
            }
          }
        } else if (select.type === 'select-one') {
          // console.log('select.type', 'select-one');
          // 檢查選擇的值是否與指定的選項值之一相同
          if (optionValues[index].includes(this.value)) {
            container.style.display = 'block'; // 顯示輸入欄位
            input.required = true; // 設定輸入為必填項目
          } else {
            container.style.display = 'none'; // 隱藏輸入欄位
            input.required = false; // 取消輸入的必填設定
            input.value = ''; // 取消時，清空input欄位
          }
        }
      });
    });
  }

  // 函數: 處理多個單選、複選框資料
  function handleFormOptionChange(selectIds, containerIds, inputIds, optionValues) {
    for (var i = 0; i < selectIds.length; i++) {
      var selectId = selectIds[i];
      var containerId = containerIds[i];
      var inputId = inputIds[i];
      var optionValue = optionValues[i];

      handleOptionsChange([selectId], [containerId], [inputId], [optionValue]);
    }
  }

  // 填入多個單選、複選框資料，若複選框有多個要控制顯示的目標，可以用'A, B, C'來打包進去
  handleFormOptionChange(
    // 單選、複選框特定 id
    [
      'livingEnvironmentChoice',
      'foreign_caregiver',
      'family_member',
      'livingChoice_other',
      'mainCaregiverRelationChoice',
      'phraseChoice',
      'other_assistiveDevices',
      'isReceivedTrainChoice',
      'other_medicalSiagnosis',
      'other_facingDifficultyChoice'
    ],
    // 單選、複選輸入框判斷顯示用 id
    [
      'livingEnvironmentDescriptionContainer',
      'residentDescriptionContainer_0',
      'residentDescriptionContainer_1',
      'residentDescriptionContainer_2',
      'mainCaregiverRelationDescriptionContainer',
      'phraseDescriptionContainer',
      'assistiveDevicesDescriptionContainer',
      'isReceivedTrainDescriptionContainer',
      'medicalSiagnosisDescriptionContainer',
      'facingDifficultyDescriptionContainer'
    ],
    // 單選、複選輸入框判斷輸入用 id
    [
      'livingEnvironmentDescription',
      'residentDescription_2',
      'residentDescription_3',
      'residentDescription_99',
      'mainCaregiverRelationDescription',
      'phraseDescription',
      'assistiveDevicesDescription_99',
      'isReceivedTrainDescription',
      'medicalSiagnosisDescription_99',
      'facingDifficultyDescription_99'
    ],
    // 單選、複選框需要判斷的value
    ['99', '2', '3', '99', '99', '99', '99', '2', '99', '99']
  );

  // 監聽 radio 元素的變更事件
  sendToEmailRadio.on("change", sendToEmailAction);
  useElectronicCarrierRadio.on("change", useElectronicCarrierAction);

});

let uploadAvatarInstance;       // 教練註冊, 形象照片
let uploadThumbnailInstance;    // 教練註冊, 小照片
let expertiseInstance;          // 教練, 專長檢歷
let licenseInstance;            // 教練註冊, 上傳證照 
let fileUploadInstance;         // 個案照片上傳  
let signUpPageInstance;         // 主要使用於鄉鎮init
$(window).on('load', function () {

  // 檢查localStorage中的"*type"值是否存在，用於儲存使用者手動返回上一頁面的狀態，避免頁面顯示錯誤。
  var type = localStorage.getItem("type"); // 個人、教練註冊
  var coachType = localStorage.getItem("coachType"); // 教練類型

  updateType(type); // 處理type變化
  updateServiceName(type, coachType); // 處理serviceName變化

  $("input[name=type]").change(function () {
    localStorage.setItem("type", this.value);

    if (this.value === "personal") {
      $("#user-detail").show();
      $("#contactDetaill").show();
      $("#coach-detail").hide();
      $("#coach-detail :input").val("");                   // 清空教練頁面input資料
      initCoachFields();                                   // clear coach            
      $("#selectServiceArea").selectpicker("deselectAll"); // 取消所有的多選狀態  ****************
      $("#selectServiceBase").selectpicker("deselectAll"); // 取消所有的多選狀態 清除多選時只能用此法
      // $("#selectServiceArea").selectpicker("refresh");  // 刷新會整個資料在跑一遍。
      $('#sex').val(getDefaultValue($('#sex')));           // init sex
      $('#lifeSatisfaction').val(getDefaultValue($('#lifeSatisfaction')));  // init lifeSatisfaction
      $('#invoiceType').val(getDefaultValue($('#invoiceType')));            // init invoiceType
      $("#twzipcode").twzipcode('reset');                                   // reset init twzipcode
      $('#livingEnvironmentChoice').val(getDefaultValue($('#livingEnvironmentChoice')));
      $('#mainCaregiverRelationChoice').val(getDefaultValue($('#mainCaregiverRelationChoice')));
      $('#phraseChoice').val(getDefaultValue($('#phraseChoice')));
      $('#familySupportChoice').val(getDefaultValue($('#familySupportChoice')));
      $('#trainAmbitionChoice').val(getDefaultValue($('#trainAmbitionChoice')));
      $('#classificationChoice').val(getDefaultValue($('#classificationChoice')));
      $('#isReceivedTrainChoice').val(getDefaultValue($('#isReceivedTrainChoice')));
      $('#relationship').val(getDefaultValue($('#relationship')));

      listenInvoiceType($('#invoiceType').val());
      // 監聽 發票種類 
      clearCheckbox($('#sendToEmail'));
      clearCheckbox($('#useElectronicCarrier'));


    } else if (this.value === "coach") {
      console.log('is coach')
      $("#coach-detail").show();
      $("#user-detail").hide();
      $("#user-detail :input").val(""); // 清空個人頁面input資料
      initUserFields(); // clear user 
      $("#serviceName").text("服務區域");
      // 切換個案、教練註冊後確保載入
      $("select[id=selectServiceArea]").change(function () {
        handleSelectServiceAreaChange($(this)); // 更新 服務區域 下方文字
      });
      $("select[id=selectServiceBase]").change(function () {
        handleSelectServiceBaseChange($(this)); // 更新 服務據點 下方文字
      });

      // 判斷 coachType 是否為空，要帶入哪一個值
      if (coachType === null || coachType === undefined) {
        coachType = getDefaultValue($('#coachType'));
      }
      $('#coachType').val(coachType);   // init coachType by localstorage
    }

    updateServiceName(this.value, coachType);
  });

  $("select[id=coachType]").change(function () {
    handleCoachTypeChange();
  });

  // F5以後確保載入
  $("select[id=selectServiceArea]").change(function () {
    handleSelectServiceAreaChange($(this)); // 更新 服務區域 下方文字
  });
  $("select[id=selectServiceBase]").change(function () {
    handleSelectServiceBaseChange($(this)); // 更新 服務據點 下方文字
  });
});

// 返回 第一個 預設值
function getDefaultValue(selectElement) {
  return selectElement.find('option:first').val();
}

// 清空 checkbox
function clearCheckbox(checkboxElement) {
  checkboxElement.prop('checked', false);
}

// 監聽發票種類
function listenInvoiceType(value) {
  if (value === "2") {
    $("#invoiceType_two").show();
    $("#invoiceType_three").hide();
  } else if (value === "3") {
    $("#invoiceType_two").hide();
    $("#invoiceType_three").show();
  }
}

// 函数用于更新 #type 的内容
function updateType(type) {
  if (type === "personal") {
    $('input[name=type][value=personal]').prop('checked', true);
    $("#user-detail").show();
    $("#coach-detail").hide();
  } else if (type === "coach") {
    $('input[name=type][value=coach]').prop('checked', true);
    $("#coach-detail").show();
    $("#user-detail").hide();
  }
}

// 函数用于更新 #serviceName 的内容
function updateServiceName(type, coachType) {
  if (type === "personal") {
    $("#serviceName").text("服務區域");
  } else if (type === "coach") {
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
}

// 更新 服務區域 下方文字
// function handleSelectServiceAreaChange($select) { 
//   var regions = "";
//   var options = $select.find("option:selected");
//   options.each(function () {
//     var label = $(this).parent().attr("label");
//     var text = $(this).text();
//     regions += label + text + "、";
//   });
//   regions = regions.slice(0, -1); // 移除最后的「、」
//   $("#serviceShowServiceArea").text(regions).css("color", "black");
// }
function handleSelectServiceAreaChange($select) {
  let regions = [];
  const options = $select.find("option:selected");
  options.each(function () {
    const label = $(this).parent().attr("label");
    const text = $(this).text();
    regions.push(label + text);
  });
 
  let formattedText = "";
  for (let i = 0; i < regions.length; i++) {
    formattedText += regions[i];

    // 每3個項目加一個換行，或者最後一個項目直接加上
    if ((i + 1) % 3 === 0 || i === regions.length - 1) {
      formattedText += "<br>";
    } else {
      formattedText += "、";
    }
  }
  $("#serviceShowServiceArea").html(formattedText).css("color", "black");
}

// 更新 服務據點 下方文字
// function handleSelectServiceBaseChange($select) { 
//   var options = $select.find("option:selected");
//   var bases = "";
//   options.each(function () {
//     var text = $(this).text();
//     bases += text + "、";
//   });
//   bases = bases.slice(0, -1); // 移除最后的「、」
//   $("#serviceShowServiceBase").text(bases).css("color", "black");
// }
function handleSelectServiceBaseChange($select) {
  var options = $select.find("option:selected");
  var bases = [];

  // 收集所有選中的選項
  options.each(function () {
    var text = $(this).text();
    bases.push(text);
  });

  var formattedBases = "";

  // 遍歷 bases 陣列，每6個項目插入一個 <br>
  for (let i = 0; i < bases.length; i++) {
    formattedBases += bases[i];

    if ((i + 1) % 6 === 0 || i === bases.length - 1) {
      formattedBases += "<br>";
    } else {
      formattedBases += "、";
    }
  }

  // 更新 HTML 內容
  $("#serviceShowServiceBase").html(formattedBases).css("color", "black");
}

// 函数用于處理教練類型變化事件
function handleCoachTypeChange() {
  var coachType = $("select[id=coachType]").val();
  localStorage.setItem("coachType", coachType);

  if (coachType === "1") {
    $("#serviceArea").show();
    $("#serviceBase").hide();

    $("#serviceName").text("服務區域");

    $("#serviceAreaText").show();
    $("#serviceBaseText").hide();

    $("select[id=selectServiceArea]").change(function () {
      handleSelectServiceAreaChange($(this)); // 更新 服務區域 下方文字
    });

  } else if (coachType === "2") {
    $("#serviceArea").hide();
    $("#serviceBase").show();

    $("#serviceName").text("服務據點");

    $("#serviceAreaText").hide();
    $("#serviceBaseText").show();

    $("select[id=selectServiceBase]").change(function () {
      handleSelectServiceBaseChange($(this)); // 更新 服務據點 下方文字
    });
  }
}

// 初始化個人註冊頁面的資料
function initUserFields() {
  fileUploadInstance.reset();
}

// 初始化教練註冊頁面的資料
function initCoachFields() {
  uploadAvatarInstance.reset();
  uploadThumbnailInstance.reset();
  expertiseInstance.reset();
  licenseInstance.reset();
}

// 切換密碼顯示
function initTogglePassword(toggleButtonId, passwordInputId) {
  const togglePasswordButton = document.getElementById(toggleButtonId);
  const passwordInput = document.getElementById(passwordInputId);

  togglePasswordButton.addEventListener("click", function () {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePasswordButton.classList.remove("fa-eye");
      togglePasswordButton.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      togglePasswordButton.classList.remove("fa-eye-slash");
      togglePasswordButton.classList.add("fa-eye");
    }
  });
}

(function () {

  // 教練註冊, 形象照片
  class UploadAvatar {
    $input = $("#upload_avatar");
    $placeholder = $("#upload_avatar_placeholder");
    $img = $("#upload_avatar_img");

    file = null;

    constructor() {
      this.$input.on("change", this.onChange);
    }

    /**
     * 未完成
     * 需要檢查寬高
     */
    onChange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.addEventListener("load", this.onLoad);

      reader.readAsDataURL(file);

      this.file = file;
    };

    onLoad = (event) => {
      this.$placeholder.hide();
      this.$img.attr("src", event.target.result).width(120).height(160).show();
    };

    getFiles() {
      return this.file;
    }

    reset() {
      this.$input.val('');
      this.$placeholder.show();
      this.$img.attr('src', '').hide();
      this.file = null;
    }
  }

  // 教練註冊, 小照片
  class UploadThumbnail {
    $input = $("#upload_thumbnail");
    $placeholder = $("#upload_thumbnail_placeholder");
    $img = $("#upload_thumbnail_img");

    file = null;

    constructor() {
      this.$input.on("change", this.onChange);
    }

    static _instance = null;

    static getInstance() {
      if (!UploadThumbnail._instance) {
        UploadThumbnail._instance = new UploadThumbnail();
      }
      return UploadThumbnail._instance;
    }

    /**
     * 未完成
     * 需要檢查寬高
     */
    onChange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      // const img = new Image();

      // img.onload = () => {
      //   if (img.width <= 420 && img.height <= 560) {
      //     alert('圖片尺寸必須是 420x520 !');
      //   }
      // };

      reader.addEventListener("load", this.onLoad);

      reader.readAsDataURL(file);

      this.file = file;
    };

    onLoad = (event) => {
      this.$placeholder.hide();
      this.$img.attr("src", event.target.result).width(120).height(120).show();
    };

    getFiles() {
      return this.file;
    }

    reset() {
      this.$input.val('');
      this.$placeholder.show();
      this.$img.attr('src', '').hide();
      this.file = null;
    }
  }

  // 教練, 專長檢歷
  class Expertise {
    $container = $("#newinput");
    data = [];
    // _currentAdd = null; // 用來判斷前面是否有欄位

    constructor() {
      this.onAdd(); // 建立初始化 input 欄位
    }

    // 新增按鈕的功能實作
    onAdd = () => {
      const $row = $('<div id="row"></div>');
      const $inputGroup = $(
        '<div class="input-group" style="display: flex; align-items: center; margin-bottom: 16px; flex-wrap: nowrap"></div>'
      );
      const $input = $('<input class="section2_input" type="text" style="width: 268px;">');
      const $delete = $(
        '<img src="../../assets/delete.svg" id="service_delete" alt="alt text" style="margin-left: 12px;" >'
      );
      const $plus = $(
        '<img src="../../assets/plus.svg" id="service_add" alt="alt text" style="margin-left: 12px;">'
      );

      const id = String(new Date().valueOf()) + Math.random().toString(36).substring(2, 7);

      $delete.on("click", () => this.onRemove(id));
      $plus.on("click", () => this.onAdd());
      $inputGroup.append($input);

      $inputGroup.append($delete).append($plus);
      $row.append($inputGroup);

      this.$container.append($row);
      this.data.push({ id, $row, $input, $delete });

      if (this.data.length > 1) {
        const prevItem = this.data[this.data.length - 2];
        prevItem.$row.find("#service_add").remove();
      }

    };

    // 刪除按鈕的功能實作
    onRemove(id) {
      if (this.data.length <= 1) {
        let onRemoveAlertMsg = '不能刪除最後一個簡歷欄位!';
        console.log(onRemoveAlertMsg);
        new CustomAlert({ content: onRemoveAlertMsg });
        return; // 如果只有一個項目，則返回，不執行刪除
      }

      const item = this.data.find((item) => item.id === id);
      const isLastItem = this.data.indexOf(item) === this.data.length - 1;

      if (item) { // 檢查項目是否存在
        console.log('item onRemove', item);
        item.$row.remove();
        this.data = this.data.filter((item) => item.id !== id);
      } else {
        console.log('Item with id', id, 'not found');
      }

      // 如果被刪除的是最後一個項目，將+號添加到新的最後一個項目上
      if (isLastItem && this.data.length > 0) {
        const $plus = $(
          '<img src="../../assets/plus.svg" id="service_add" alt="alt text" style="margin-left: 12px;">'
        );
        $plus.on("click", () => this.onAdd());
        this.data[this.data.length - 1].$row.find('.input-group').append($plus);
      }
    }

    // 取得 專長檢歷 data
    getResData() {
      const res = this.data
        .filter((item) => !!item.$input.val())
        .map((item) => item.$input.val());

      return res.length ? res : [];
    }

    reset() {
      this.$container.empty();
      this.data = [];
      this.onAdd(); // 添加初始的输入字段
    }

    static _instance = null;

    static getInstance() {
      if (!Expertise._instance) {
        Expertise._instance = new Expertise();
      }
      return Expertise._instance;
    }
  }

  // 教練註冊, 上傳證照
  class License {
    $container = $("#new_certs");
    $addBtn = $("#certs_add");
    // { id, $rowDom, $inputDom }
    data = [];

    constructor() {
      this.$addBtn.on("click", this.onAdd);
    }

    static _instance = null;

    static getInstance() {
      if (!License._instance) {
        License._instance = new License();
      }
      return License._instance;
    }

    // 取得 上傳證照 data
    getResData() {
      const res = this.data
        .filter((item) => !!item.file)
        .map((item) => item.file);

      return res.length ? res : undefined;
    }

    onAdd = () => {
      if (this.data.length >= 5) { // 如果目前已有五筆資料，不再新增
        console.log("如果目前已有五筆資料，不再新增項目");
        return;
      }

      if (this.data.length > 0) {
        const lastItem = this.data[this.data.length - 1];

        // console.log("lastItem", lastItem);
        if (!lastItem.file) {
          // 最後一個項目沒有圖片，不新增項目
          console.log("最後一個項目沒有圖片，不新增項目");
          return;
        }
      }

      const $card = $(
        '<div class="section4__box" style="width: 200px; height: 125px; justify-content: center; align-items: center; "></div>'
      );
      const $input = $(
        '<input type="file" accept="image/jpeg, image/png, image/jpg" hidden="">'
      );
      const $label = $("<label></label>");
      const $img = $(
        '<img id="upload_certs_img" src="#" alt="" style="display: none;" />'
      );
      const $placeholder = $(
        '<div class="cell" id="upload_certs_placeholder"> <img src="../../assets/avatar_plus.svg" alt="alt text" class="section4__icon"> <h5 class="section4__highlights1">320X200</h5> </div>'
      );
      const $deleteBtn = $('<img src="../../assets/delete.svg" id="service_delete" alt="alt text">');


      const id = String(new Date().valueOf());

      // 一個 label for 對應一個 input id
      $input.attr("id", id);
      $label.attr("for", id);

      $input.on("change", (event) => {
        this.onChange(event, id);
      });

      $deleteBtn.on("click", () => {
        this.onDelete(id);
      });

      $label.append($img).append($placeholder).append($deleteBtn);
      $card.append($input).append($label);
      this.$container.append($card);

      this.data.push({
        id,
        $rowDom: $card,
        $inputDom: $input,
        $img,
        $placeholder,
        file: null,
      });

      $card.css({
        width: "200px",
        height: "125px",
        justifyContent: "center",
        alignItems: "center",
        position: "relative" //新增一個相對定位屬性
      });

      $deleteBtn.css({
        position: "absolute", //新增一個絕對定位屬性
        top: "0",
        right: "-27px", //調整位置到照片的正右方
        width: "20px",
        height: "20px",
        cursor: "pointer"
      });

      $label.append($img).append($placeholder).append($deleteBtn); //將刪除按鈕加入label元素

    };

    onDelete = (id) => {
      const index = this.data.findIndex((item) => item.id === id);
      if (index >= 0 && this.data[index].$rowDom) {
        const $card = this.data[index].$rowDom;
        $card.remove();
        this.data.splice(index, 1);
      }
    };

    onChange = (event, id) => {
      const file = event.target.files[0];
      const item = this.data.find((item) => item.id === id);
      const reader = new FileReader();

      reader.addEventListener("load", (loadEvent) => {
        this.onLoad(loadEvent, id);
      });

      reader.readAsDataURL(file);

      item.file = file;
    };

    onLoad = (event, id) => {
      const item = this.data.find((item) => item.id === id);

      item.$placeholder.hide();

      item.$img.attr("src", event.target.result).width(200).height(125).show();
    };

    // getFiles() {
    //   return this.data;
    // }

    // 改成跟個案返回的檔案類型一致
    getFiles() {
      return this.data.map(item => item.file);
    }

    reset() {
      this.$container.empty();
      this.data = [];
    }
  }

  // 個案用戶, 檔案資料
  class FileUpload {
    $fileUpload = $("#file-upload");
    $fileName = $("#file-upload-filename");
    // 5MB
    maxSize = 5242880;
    errorMessage = "檔案資料限制單檔5MB";
    file = null;
    files = [];

    constructor() {
      this.$fileUpload.on("change", this.onFileUpload);
    }

    // 改寫onFileUpload，改成最多上傳五個檔案，超過則警示
    onFileUpload = (event) => {
      const newFiles = event.target.files;

      let addedFiles = 0;

      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        if (file.size > this.maxSize) {
          new CustomAlert({ content: this.errorMessage });
        } else if (this.files.length >= 5) {
          new CustomAlert({ content: "最多只能上傳五個檔案" });
          break;
        } else {
          this.files.push(file);
          addedFiles++;
          // const fileName = $("<div>").text(file.name);
          // this.$fileName.append(fileName);
        }
      }

      if (addedFiles > 0) {
        this.renderFileList();
      }
    };

    onDeleteFile = (event, index) => {
      // console.log('delete');
      this.files.splice(index, 1);
      this.renderFileList(); // 调用重新渲染文件列表
    };

    renderFileList = () => {
      this.$fileName.empty();

      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i];
        //console.log("file", file);
        const fileItem = $("<div>").addClass("file-item");
        const fileContent = $("<div>").addClass("file-content");
        const fileName = $("<div>").addClass("file-name").text(file.name);
        const $deleteBtn = $('<img src="../../assets/delete.svg" id="files_delete_' + i + '" class="delete-button" alt="alt text" style="margin-left: 12px; float: right;">');
        $deleteBtn.data("fileIndex", i);
        $deleteBtn.on("click", (event) => {
          // this.onDeleteFile(event, i);
          const fileIndex = $(event.target).data("fileIndex");
          this.onDeleteFile(event, fileIndex);
        });
        fileContent.append(fileName).append($deleteBtn);
        fileItem.append(fileContent);
        this.$fileName.append(fileItem);
      }
    };

    getFiles() {
      return this.files;
    }

    reset() {
      this.files = [];
      this.$fileUpload.val('');
      this.$fileName.empty();
      // console.log('userUploadFile clear.');
    }

  }

  class SignUpPage {
    // 選擇縣市
    $twzipcode = $("#twzipcode");
    $userAddress = $("#userAddress");
    $form = $("#form");
    $submitButton = $("#submit-button");

    $addExpertise = $("#service_add");
    $deleteExpertis = $("#service_delete");

    fileUploadIns = null;
    expertiseIns = null;
    uploadAvatarIns = null;
    uploadThumbnailIns = null;
    licenseIns = null;

    constructor(props) {
      // 個人
      this.fileUploadIns = props.fileUploadIns;

      // 教練
      this.expertiseIns = props.expertiseIns;
      this.uploadAvatarIns = props.uploadAvatarIns;
      this.uploadThumbnailIns = props.uploadThumbnailIns;
      this.licenseIns = props.licenseIns;

      this.init();
    }

    init() {
      // console.log('init zip');
      $("#twzipcode").twzipcode({
        css: [
          "city section2_input section2_select",
          "town section2_input section2_select mt-1",
        ], // 自訂 "城市"、"地區" class 名稱
        countyName: "city", // 自訂城市 select 標籤的 name 值
        districtName: "town", // 自訂地區 select 標籤的 name 值
        onCountySelect: this.onChangeTwzipcode,
        onDistrictSelect: this.onChangeTwzipcode,
      });

      this.$form.on("submit", (event) => event.preventDefault());
      this.$submitButton.on("click", this.onSubmit);

      this.postServiceDataAPI();
    }

    onExpertiseAdd = () => {
      $("#newinput").append(
        '<div id="row">' +
        '<div class="input-group m-3" style="display: flex; align-items: center; margin-bottom: 16px">' +
        '<input class="section2_input" type="text">' +
        '<img src="../../assets/delete.svg" style="margin-left: 12px;" alt="alt text" id="service_delete" />' +
        "</div></div>"
      );
    };

    // 選擇縣市後修改地址
    onChangeTwzipcode = () => {
      const county = this.$twzipcode.twzipcode("get", "county")[0];
      const district = this.$twzipcode.twzipcode("get", "district")[0];

      if (county && district) {
        const userAddress = `${county}${district}`;
        this.$userAddress.val(userAddress);
      }
    };

    onSubmit = () => {
      const type = this.$form[0].type.value;
      // console.log("type: " + type);
      if (type === "personal") {
        this.postUserDetailAPIUrlAPI();
      } else {
        this.postCoachDetailAPIUrlAPI();
      }
    };

    // 取得被選中的複選選項值、與對應輸入框的input值
    getCheckboxData = (checkboxName, inputIdPrefix, inputValues) => {
      let checkboxValues = Array.from(document.querySelectorAll(`input[name="${checkboxName}"]:checked`)).map(el => parseInt(el.value));
      let data = {
        choice: JSON.stringify(checkboxValues),
        description: {}
      };

      checkboxValues.forEach(value => {
        console.log('checkboxValues:', checkboxValues);
        let inputId = `${inputIdPrefix}_${value}`;
        console.log('inputId:', inputId);
        console.log('value:', value);
        console.log('inputValues:', inputValues);
        if (inputValues.includes(value)) { // 確認取得的欄位是特定有輸入框的欄位 
          let inputValue = document.getElementById(inputId).value;
          data.description[value] = inputValue;
        }
      });

      // let jsonData = JSON.stringify(data);

      // console.log('jsonData:', jsonData);

      // console.log('date:', data);

      return data;
    }

    /**
     * 完成
     * 日期, 格式 V
     * 性別, 格式 V
     * 對目前生活的滿意度, 格式 
     * 如果取到的值不對, 可以去改 html, 例如: <option value="1">男</option> 的 value
     */
    getUserFormData() {
      const formData = this.$form.serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});

      const county = this.$twzipcode.twzipcode("get", "county")[0]; // 居住縣市
      const district = this.$twzipcode.twzipcode("get", "district")[0]; // 居住區域

      const files = fileUploadIns.getFiles(); // 取得整包上傳檔案資料
      let fileName = JSON.stringify(files.map(file => file.name)); // 處理檔案名稱，數組，需為json，才能傳送成功
      console.log("fileName", fileName);

      const invoiceType = $("select[id=invoiceType]").val(); // 發票種類 2=二聯式、3=三聯式
      let sendToEmail = null;           // 是否寄送到Email
      let useElectronicCarrier = null;  // 是否使用電子載具
      let phoneCarrierNumber = null;    // 手機載具號碼
      let invoiceTitle = null;          // 受買人抬頭
      let taxID = null;                 // 受買人統編
      let deliveryOption = null ; //選擇寄送到Email還是電子載具
      // 處理發票資料傳送類型
      if (invoiceType === "2") { // 二聯式資料
        // sendToEmail = formData.sendToEmail ? "true" : "false";
        // useElectronicCarrier = formData.useElectronicCarrier ? "true" : "false";
        deliveryOption = formData.deliveryOption;
        phoneCarrierNumber = formData.phoneCarrierNumber;
      } else if (invoiceType === "3") { // 三聯式資料
        invoiceTitle = formData.invoiceTitle;
        taxID = formData.taxID;
      }

      let residentData = this.getCheckboxData('residentChoice', 'residentDescription', [2,3, 99]); // 處理複選項目 個案目前的同住者(複選)
      let assistiveDevicesData = this.getCheckboxData('assistiveDevicesChoice', 'assistiveDevicesDescription', [99]); // 處理複選項目 目前正在使用的輔具(複選)
      let medicalSiagnosisData = this.getCheckboxData('medicalSiagnosisChoice', 'medicalSiagnosisDescription', [99]); // 處理複選項目 醫療診斷(複選)
      let facingDifficultyData = this.getCheckboxData('facingDifficultyChoice', 'facingDifficultyDescription', [99]); // 處理複選項目 生活上面臨哪些困難(複選)
      let medicalCasHistoryData = this.getCheckboxData('medicalCaseHistory', 'medicalCaseHistoryDescription', [99]); // 處理複選項目 醫病史(複選)

      return {
        userName: formData.userName,                     // 個案名稱
        userNickName: formData.userNickName,             // 個案喜歡稱呼
        idNumber: formData.userIdNumber,                 // 身分證字號(帳號)
        password: formData.userPassword,                 // 密碼
        sex: formData.sex,                               // 性別
        birthDate: formData.birthDate,                   // 出生日期
        height: formData.height,                         // 身高 (cm)
        weight: formData.weight,                         // 體重 (kg)
        livingEnvironmentChoice: formData.livingEnvironmentChoice,                     // 居住環境(單選)
        livingEnvironmentDescription: formData.livingEnvironmentDescription,           // 居住環境(其他補充)
        county,                                                                        // 居住縣市
        district,                                                                      // 居住區域
        address: formData.userAddress,                                                 // 居住完整地址
        residentChoice: residentData.choice,                                           // 個案目前的同住者(複選)
        residentDescription: JSON.stringify(residentData.description),                 // 個案目前的同住者(選項補充)
        mainCaregiverName: formData.mainCaregiverName,                                 // 主要照顧者姓名
        mainCaregiverRelationChoice: formData.mainCaregiverRelationChoice,             // 主要照顧者與個案關係(單選)
        mainCaregiverRelationDescription: formData.mainCaregiverRelationDescription,   // 主要照顧者與個案關係(其他補充)
        mainCaregiverPhone: formData.mainCaregiverPhone,                               // 主要照顧者手機
        phraseChoice: formData.phraseChoice,                                           // 慣用語(單選)
        phraseDescription: formData.phraseDescription,                                 // 慣用語(其他補充)
        symptom: formData.symptom,                                                     // 個案症狀
        physicalMobility: formData.physicalMobility,                                   // 身體行動能力
        // assistiveDevices: formData.assistiveDevices,                                // 目前正在使用的輔具() 0630 移除原本的，新增下方的。
        assistiveDevicesChoice: assistiveDevicesData.choice,                           // 目前正在使用的輔具(複選)
        assistiveDevicesDescription: JSON.stringify(assistiveDevicesData.description), // 目前正在使用的輔具(選項補充)
        careerBackground: formData.careerBackground,                                   // 職業背景
        hobby: formData.hobby,                                                         // 特別喜歡、重視的事物、音樂
        lifeSatisfaction: formData.lifeSatisfaction,                                   // 對目前生活的滿意度
        familySupportChoice: formData.familySupportChoice,                             // 家庭支持度(單選)
        trainAmbitionChoice: formData.trainAmbitionChoice,                             // 個案參與復能訓練的企圖心(單選)
        classificationChoice: formData.classificationChoice,                           // 功能分級(單選)
        isReceivedTrainChoice: formData.isReceivedTrainChoice,                         // 個案目前是否有接受復能訓練(單選)
        isReceivedTrainDescription: formData.isReceivedTrainDescription,               // 個案目前是否有接受復能訓練(選項補充)
        medicalSiagnosisChoice: medicalSiagnosisData.choice,                           // 醫療診斷(複選)
        medicalSiagnosisDescription: JSON.stringify(medicalSiagnosisData.description), // 醫療診斷(補充)
        disabilityLevel: formData.disabilityLevel,
        longTermCareCMS: formData.cms,
        medicalCaseHistory: medicalCasHistoryData.choice,
        facingDifficultyChoice: facingDifficultyData.choice,                           // 面臨哪些困難(複選)
        facingDifficultyDescription: JSON.stringify(facingDifficultyData.description), // 面臨哪些困難(補充)
        aboveStatusTime: formData.aboveStatusTime,       // 以上狀態發生至今維持多久
        threeMonthGoal: formData.threeMonthGoal,         // 請個案描述未來三個月想達成的目標
        mostWantToDo: formData.mostWantToDo,             // 個案恢復生活自理後，最想做的事是什麼
        contactName: formData.contactName,               // 聯絡人名稱
        relationship: formData.relationship,             // 與個案關係(單選)
        contactPhoneNumber: formData.contactPhoneNumber, // 聯絡人手機
        contactEmail: formData.contactEmail,             // Email
        contactLineId: formData.contactLineId,           // 聯絡人 LINE ID
        suitContactTime: formData.suitContactTime,       // 適合聯絡時間
        suitEvaluateTime: formData.suitEvaluateTime,     // 方便評估個案的時段
        invoiceType: formData.invoiceType,               // 發票種類(2、3)
        sendToEmail: sendToEmail,                        // 寄送到 Email(TRUE OR FALSE)
        useElectronicCarrier: useElectronicCarrier,      // 使用電子載具(TRUE OR FALSE)
        phoneCarrierNumber: phoneCarrierNumber,          // 手機載具號碼
        invoiceTitle: invoiceTitle,                      // 受買人抬頭
        taxID: taxID,                                    // 受買人統編
        fileName: fileName,                              // 上傳檔案名稱
        deliveryOption : deliveryOption  //寄送到Email或使用電子載具
      };
    }

    // 檢查file與file.name是否為空
    getFileName(file) {
      return file !== null && file.name !== null ? file.name : '';
    }

    /**
     * 完成
     * 教練類別, 格式 V
     * 服務區域, 格式 + 內容 V
     * 服務據點, 格式 + 內容 V
     * 專長簡歷, 格式 V
     */
    getCoachFormData() {
      const formData = this.$form.serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});

      const invoiceType = $("select[id=coachType]").val(); // 教練類型 1=專業評估教練、2=自主應用教練
      let serviceArea = {};
      let serviceBase = [];
      let expertise = [];

      expertise = JSON.stringify(expertiseIns.getResData()); // 專長簡歷

      const uploadAvatar = uploadAvatarIns.getFiles();             // 取得 形象照片   上傳檔案資料
      const uploadThumbnail = uploadThumbnailIns.getFiles();       // 取得 頭像小照片 上傳檔案資料
      const licenseFiles = licenseIns.getFiles();                  // 取得 證照名稱   上傳檔案資料
      let imagePhoto = this.getFileName(uploadAvatar);             // 處理檔案名稱，數組，需為json，才能傳送成功
      let smallPhoto = this.getFileName(uploadThumbnail);          // 處理檔案名稱，數組，需為json，才能傳送成功
      let license = JSON.stringify(licenseFiles.map(obj => obj.name)); // 處理檔案名稱，數組，需為json，才能傳送成功

      if (invoiceType === "1") {
        // 專業評估教練
        let selectedServiceArea = $('#selectServiceArea').val(); // 取得被選中的服務區域的值
        for (let i = 0; i < selectedServiceArea.length; i++) {
          let [label, value] = selectedServiceArea[i].split('_');
          if (!serviceArea[label]) {
            serviceArea[label] = [];
          }
          serviceArea[label].push(value);
        }
      } else if (invoiceType === "2") {
        // 自主應用教練
        serviceBase = $('#selectServiceBase').val(); // 取得被選中的所屬據點的值
      }

      serviceArea = JSON.stringify(serviceArea);
      serviceBase = JSON.stringify(serviceBase);

      console.log("expertise", expertise);
      console.log("serviceArea", serviceArea);
      console.log("serviceBase", serviceBase);
      console.log("imagePhoto", imagePhoto);
      console.log("smallPhoto", smallPhoto);
      console.log("license", license);

      return {
        coachType: formData.coachType,              // 教練類別 1:專業評估教練 2:自主應用教練
        serviceArea: serviceArea,                   // 服務區域(提供格式如 serviceData API 回傳的 serviceArea)
        serviceBase: serviceBase,                   // 服務據點(提供格式如 serviceData API 回傳的 serviceBase)
        coachName: formData.coachName,              // 教練名稱
        phoneNumber: formData.phoneNumber,          // 教練手機
        idNumber: formData.coachIdNumber,           // 帳號(身分證字號)
        password: formData.coachPassword,           // 密碼
        lineId: formData.lineId,                    // LINE ID
        email: formData.email,                      // Email
        residenceAddress: formData.residenceAddress,// 戶籍地址
        mailingAddress: formData.mailingAddress,    // 通訊地址
        expertise: expertise,                       // 專長簡歷
        selfIntroduction: formData.selfIntroduction,// 自我介紹 (限 200 字)
        remarks: formData.remarks,                  // 特殊備註 (限 200 字)
        imagePhoto: imagePhoto,                     // 形象照片(檔案名稱+檔案類型) EX:123.PNG
        smallPhoto: smallPhoto,                     // 頭像小照片(檔案名稱+檔案類型) EX:123.PNG
        license: license,                           // 證照名稱 EX: ["123.PDF","456.DOCX"]
      };
    }

    // 讀取服務列表
    postServiceDataAPI() {
      let session_Id = null;
      let action = "select";
      let chsm = "upStrongServiceDataApi";
      if (action === 'select') {
        chsm = $.md5(action + chsm);
      } else {
        chsm = $.md5(session_Id + action + chsm);
      }

      $.ajax({
        url: `${window.apiUrl}${window.apiserviceData}`,
        type: "POST",
        data: {
          session_Id,
          action,
          chsm,
        },
        success: function (res) {
          console.log("postServiceDataAPI", res);
          // 取得 選擇服務區域 select 元素
          let $serviceAreaSelect = $("#selectServiceArea");
          // 取得 選擇所屬據點 select 元素
          let $serviceBaseSelect = $("#selectServiceBase");

          // 動態生成 選擇服務區域 選項元素
          for (let area in res.returnData.serviceArea) {
            let $optgroup = $("<optgroup>").attr("label", area);
            for (let i = 0; i < res.returnData.serviceArea[area].length; i++) {
              let tempArea = res.returnData.serviceArea[area][i];
              let $option = $("<option>").attr("value", area + '_' + tempArea).text(tempArea); // optgroup 底下的label，的option選擇，可依據需求設定成所需的格式 文字/數字
              $optgroup.append($option);
            }
            $serviceAreaSelect.append($optgroup);
          }

          // 動態生成 選擇所屬據點 選項元素
          for (let i = 0; i < res.returnData.serviceBase.length; i++) {
            let tempBase = res.returnData.serviceBase[i];
            let $option = $("<option>").attr("value", tempBase).text(tempBase); // value 可依據需求更改 文字/數字
            $serviceBaseSelect.append($option);
          }

          // 刷新 selectpicker
          $serviceAreaSelect.selectpicker("refresh");
          $serviceBaseSelect.selectpicker("refresh");

        },
        error: function () {
          $("#error").text("An error occurred. Please try again later.");
        },
      });
    }

    // 個案註冊
    postUserDetailAPIUrlAPI() {
      const data = this.getUserFormData();
      const jsonData = JSON.stringify(data);
      const files = fileUploadIns.getFiles(); // 取得整包上傳檔案資料
      const formData = new FormData(); // 存最後要上傳到後端的整包資料

      let session_Id = null; // 尚未有地方可獲取，先給null
      let action = 'insert'; // 預設為insert:註冊個案資料
      let chsm = 'upStrongUserDetailApi'; // api文件相關

      // 處理chsm業務邏輯
      if (action === 'insert') {
        chsm = $.md5(action + chsm);
      } else {
        chsm = $.md5(sessionId + action + chsm);
      }

      // 處理formData整包資料
      formData.append('session_Id', session_Id);
      formData.append('action', action);
      formData.append('chsm', chsm);
      formData.append('data', jsonData);
      for (let i = 0; i < files.length; i++) {
        formData.append('file[]', files[i]);
      }

      console.log("個案註冊", "files", files);
      console.log("個案註冊", "jsonData", jsonData);



    //欄位驗證
    var  userName = $("#userName").val();
    if (userName.trim() === '') {
      new CustomAlert({ content: "請填寫 個案名稱" });
      return;
    }

    var  userNickName = $("#userNickName").val();
    if (userNickName.trim() === '') {
      new CustomAlert({ content: "請填寫 個案喜歡的稱呼" });
      return;
    }

    var  userIdNumber = $("#userIdNumber").val();
    if (userIdNumber.trim() === '') {
      new CustomAlert({ content: "請填寫 帳號 (身分證字號)" });
      return;
    }

    var  userIdNumber = $("#userPassword").val();
    if (userIdNumber.trim() === '') {
      new CustomAlert({ content: "請填寫 密碼" });
      return;
    }

    var  birthDate = $("#birthDate").val();
    if (birthDate.trim() === '') {
      new CustomAlert({ content: "請選擇 出生日期" });
      return;
    }

    var  height = $("#height").val();
    if (height.trim() === '') {
      new CustomAlert({ content: "請填寫 身高" });
      return;
    }

    var  weight = $("#weight").val();
    if (weight.trim() === '') {
      new CustomAlert({ content: "請填寫 體重" });
      return;
    }

    var livingEnvironmentChoice =  $("#livingEnvironmentChoice option:selected").val();
    var livingEnvironmentDescription = $('#livingEnvironmentDescription').val();
    if (livingEnvironmentChoice == '99' && livingEnvironmentDescription.trim() === '') {
      new CustomAlert({ content: "請填寫 居住環境其他補充說明" });
      return;
    }



    var city =  $("#city option:selected").val();
    var town =  $("#town option:selected").val();
    var userAddress = $('#userAddress').val();
    if (city == '' || town == '' || userAddress.trim() === '') {
      new CustomAlert({ content: "請填寫 縣市、鄉鎮市區、地址" });
      return;
    }


    // var foreign_caregiver = $("#foreign_caregiver").prop("checked");
    // var residentDescription_2 =  $("#residentDescription_2").val();
    // var foreign_caregiver = $("#foreign_caregiver").prop("checked");
    // var residentDescription_3 =  $("#residentDescription_3").val();
    // var livingChoice_other = $("#livingChoice_other").prop("checked");
    // var residentDescription_99 =  $("#residentDescription_99").val();
  
    // if (foreign_caregiver  == true && residentDescription_2.trim() == '') {
    //   new CustomAlert({ content: "請填寫 同住者為外籍看護的補充說明" });
    //   return;
    // }
    // if (foreign_caregiver  == true && residentDescription_3.trim() == '') {
    //   new CustomAlert({ content: "請填寫 同住者為家人的補充說明" });
    //   return;
    // }
    // if (livingChoice_other == true  && residentDescription_99.trim() == '') {
    //   new CustomAlert({ content: "請填寫 同住者 其他補充說明" });
    //   return;
    // }



    var phraseChoice =  $("#phraseChoice option:selected").val();
    var phraseDescription = $('#phraseDescription').val();
    if (phraseChoice == '99' && phraseDescription.trim() === '') {
      new CustomAlert({ content: "請填寫 慣用語的其他說明" });
      return;
    }


    var careerBackground =  $("#careerBackground").val();
    if (careerBackground.trim() === '') {
      new CustomAlert({ content: "請填寫 過往職業背景" });
      return;
    }
    

    var hobby =  $("#hobby").val();
    if (hobby.trim() === '') {
      new CustomAlert({ content: "請填寫 特別喜歡、重視的事物、音樂" });
      return;
    }


    var symptom =  $("#symptom").val();
    if (symptom.trim() === '') {
      new CustomAlert({ content: "請填寫 個案症狀" });
      return;
    }

 
    var medicalCaseHistory = $("input[name='medicalCaseHistory']:checked").length > 0;
    if (!medicalCaseHistory) {
      new CustomAlert({ content: "請勾選 醫病史" });
      return;
    } 

    var medicalSiagnosisChoice = $("input[name='medicalSiagnosisChoice']:checked").length > 0;
    if (!medicalSiagnosisChoice) {
      new CustomAlert({ content: "請勾選 醫療診斷" });
      return;
    } 

    
    var other_medicalSiagnosis = $("#other_medicalSiagnosis").prop("checked");
    var medicalSiagnosisDescription_99 =  $("#medicalSiagnosisDescription_99").val();
    if (other_medicalSiagnosis  == true && medicalSiagnosisDescription_99.trim() == '') {
      new CustomAlert({ content: "請填寫 醫療診斷其他說明" });
      return;
    }



    var disabilityLevel = $('[name="disabilityLevel"]:checked').val();
    if (disabilityLevel == null) {
      new CustomAlert({ content: "請選擇 身心障礙障別" });
      return;
    }


    var cms = $('[name="cms"]:checked').val();
    if (cms == null) {
      new CustomAlert({ content: "請選擇 長照CMS等級" });
      return;
    }


      $.ajax({
        url: `${window.apiUrl}${window.apiuserDetail}`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
          console.log("postUserDetailAPIUrlAPI", res);

          const resCode = res.returnCode;
          const resMessage = res.returnMessage;
          const resData = res.returnData;

          if (resCode !== "1") {
            // alert(resMessage);
            new CustomAlert({ content: resMessage });
          } else {
            // save sesseionId
            console.log('user signup SUCCESS');
            console.log(resData);

            // route to HomePage
            window.location.assign(
              "../HomePage/index.html"
            );
          }
        },
        error: function () {
          $("#error").text("An error occurred. Please try again later.");
        },
      });
    }

    // 教練註冊
    postCoachDetailAPIUrlAPI() {
      const data = this.getCoachFormData();
      const jsonData = JSON.stringify(data);
      const licenseFiles = licenseIns.getFiles();
      const uploadAvatar = uploadAvatarIns.getFiles();             // 取得 形象照片   上傳檔案資料
      const uploadThumbnail = uploadThumbnailIns.getFiles();       // 取得 頭像小照片 上傳檔案資料

      let session_id = null; // 尚未有地方可獲取，先給null
      let action = 'insert'; // 預設為insert:註冊個案資料
      let chsm = 'upStrongCoachDetailApi';
      if (action === 'insert') {
        chsm = $.md5(action + chsm);
        console.log("教練註冊", "chsm", chsm);
      } else {
        chsm = $.md5(session_Id + action + chsm);
      }

      const formData = new FormData();
      formData.append('session_id', session_id);
      formData.append('action', action);
      formData.append('chsm', chsm);
      formData.append('data', jsonData);
      formData.append('imagePhoto', uploadAvatar);
      formData.append('smallPhoto', uploadThumbnail);
      for (let i = 0; i < licenseFiles.length; i++) {
        formData.append('license[]', licenseFiles[i]);
      }

      console.log("教練註冊", "license", licenseFiles);
      console.log("教練註冊", "imagePhoto", uploadAvatar);
      console.log("教練註冊", "smallPhoto", uploadThumbnail);
      console.log("教練註冊", "jsonData", jsonData);
      
      $.ajax({
        url: `${window.apiUrl}${window.apicoachDetail}`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
          console.log("postUserDetailAPIUrlAPI", res);

          const resCode = res.returnCode;
          const resMessage = res.returnMessage;
          const resData = res.returnData;

          if (resCode !== "1") {
            // alert(resMessage);
            new CustomAlert({ content: resMessage });
          } else {
            // save sesseionId
            console.log('教練 signup SUCCESS');
            console.log(resData);

            // route to HomePage
            window.location.assign(
              "../HomePage/index.html"
            );
          }

        },
        error: function () {
          $("#error").text("An error occurred. Please try again later.");
        },
      });
    }
  }

  const uploadAvatarIns = new UploadAvatar();       // 教練註冊, 形象照片
  const uploadThumbnailIns = new UploadThumbnail(); // 教練註冊, 小照片
  const expertiseIns = new Expertise();             // 教練, 專長檢歷
  const licenseIns = new License();                 // 教練註冊, 上傳證照
  const fileUploadIns = new FileUpload();           // 個案用戶, 檔案資料
  const signUpPageIns = new SignUpPage({
    fileUploadIns,
    expertiseIns,
    uploadAvatarIns,
    uploadThumbnailIns,
    licenseIns,
  });

  // console.log('uploadAvatarIns', uploadAvatarIns);

  uploadAvatarInstance = uploadAvatarIns;                    // 教練註冊, 形象照片
  uploadThumbnailInstance = uploadThumbnailIns;              // 教練註冊, 小照片
  expertiseInstance = expertiseIns;               // 教練, 專長檢歷
  licenseInstance = licenseIns;                   // 教練註冊, 上傳證照
  fileUploadInstance = fileUploadIns;             // 給外部變數使用，用來init各個元件
  signUpPageInstance = signUpPageIns;
})();

