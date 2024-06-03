
const fileCompletedStatus = document.querySelector('.file-compled-status');
const fileBrowserButton = document.querySelector('.file-browse-button');
const filebrowseInput = document.querySelector('.file-browse-input');
const fileUploadBox = document.querySelector('.file-upload-box');
const filesList = document.querySelector('.file-list');

let totalFile = 0;
let completFile = 0;

const createFileItemHTM = (file, uiniqueIndentifier) => {
    //extracting file name , size and extencion
    const { name, size } = file;

    const extencion = name.split('.').pop();
    //generate html for file item
    return `
        <li class="file-item" id="file-item-${uiniqueIndentifier}">
                <div class="file-extension">${extencion}</div>
                <div class="file-content-wrapper">
                    <div class="file-content">
                        <div class="file-details">
                            <h5 class="file-name">${name}</h5>
                            <div class="file-info">
                                <small class="file-size">4 MB / ${size} MB</small>
                                <small class="file-divider"><i class="ri-circle-fill"></i></small>
                                <small class="file-status">Uploading..</small>
                            </div>
                        </div>
                        <button class="cancel-button"><i class="ri-close-line"></i></button>
                    </div>
                    <div class="file-progress-bar">
                        <div class="file-progress"></div>
                    </div>
               </div>
         </li>
    `;
};

//Function to hanlde file uploading
const handleFileUploading = (file, uiniqueIndentifier) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    const APLI_URL = 'https://api.cloudinary.com/v1_1/dvxkqpj2v/upload';
    formData.append('file', file);

    xhr.upload.addEventListener('progress', event => {
        console.log(event.loaded);
        //uploading progres bar and file size element
        const fileProgres = document.querySelector(`#file-item-${uiniqueIndentifier} .file-progress`);
        const fileZise = document.querySelector(`#file-item-${uiniqueIndentifier} .file-size`);

        //formating the uploading or total size into KB or MB accordingly 
        const formattedFileSize = file.size >= 1024 * 1024 ?
            `${(event.loaded / (1024 * 1024)).toFixed(2)} MB / ${(event.total / (1024 * 1024)).toFixed(2)} MB` :
            `${(event.loaded / 1024).toFixed(2)} KB / ${(event.total / 1024).toFixed(2)} KB`;

        const progress = Math.round((event.loaded / event.total) * 100);

        fileProgres.style.width = `${progress}%`;
        fileZise.textContent = formattedFileSize;
    });
    //opening connection to the server api endpoint and sendign the form data
    xhr.open('POST', `https://api.cloudinary.com/v1_1/dvxkqpj2v/image/upload`, true);
    xhr.send(formData);
    return xhr;
};

//Function to handle selected file
const handleSelectedFile = ([...files]) => {
    if (files.length === 0) return; // cheked if no file are selected
    totalFile += files.length;
    files.map((file, i) => {
        const uiniqueIndentifier = Date.now() + i;

        const fileHTML = createFileItemHTM(file, uiniqueIndentifier);
        //inserting each file item into lisr
        filesList.insertAdjacentHTML('afterbegin', fileHTML);
        const currentFileItem = document.querySelector(`#file-item-${uiniqueIndentifier}`);
        const cancelFileUpload = currentFileItem.querySelector('.cancel-button');
        const xhr = handleFileUploading(file, uiniqueIndentifier);

        xhr.addEventListener('readystatechange', () => {

            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                completFile++;
                cancelFileUpload.remove();
                currentFileItem.querySelector('.file-status').textContent = `Completed`;
                currentFileItem.querySelector('.file-status').style.color = `#00b125`;
                fileCompletedStatus.textContent = `${completFile} / ${totalFile} Fails Completd`;
            } else {
                console.log('no se pudo subir al servidor');
            };
        });

        //handling cancellation of file upload
        cancelFileUpload.addEventListener('click', () => {
            console.log('cancelando');
            xhr.abort(); // cancelled file 
            currentFileItem.querySelector('.file-status').textContent = `Cancelled`;
            currentFileItem.querySelector('.file-status').style.color = `#e3413f`;
            cancelFileUpload.remove();
        });
        xhr.addEventListener('error', () => {
            alert('An error ocurred dring the file upload!');
        });
    });
    fileCompletedStatus.textContent = `${completFile} / ${totalFile} Fails Completd`;

};

//Function to handle file drop event
fileUploadBox.addEventListener('drop', event => {
    event.preventDefault();
    handleSelectedFile(event.dataTransfer.files);
    fileUploadBox.classList.remove('active');
    fileUploadBox.querySelector('.file-instruction').textContent = 'Drag files here or';
});

//Function to handle file dragover event 
fileUploadBox.addEventListener('dragover', event => {
    event.preventDefault();
    fileUploadBox.classList.add('active');
    fileUploadBox.querySelector('.file-instruction').textContent = 'Release to upload or';
});

//Function to handle file dragleave event
fileUploadBox.addEventListener('dragleave', event => {
    event.preventDefault();
    fileUploadBox.classList.remove('active');
    fileUploadBox.querySelector('.file-instruction').textContent = 'Drag files here or';
});

filebrowseInput.addEventListener('change', event => handleSelectedFile(event.target.files));
fileBrowserButton.addEventListener('click', () => filebrowseInput.click());
