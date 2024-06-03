
const fileBrowserButton = document.querySelector('.file-browse-button');
const filebrowseInput = document.querySelector('.file-browse-input');
const fileUploadBox = document.querySelector('.file-upload-box');
const filesList = document.querySelector('.file-list');

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
        console.log(event);
        //uploading progres bar and file size element
        const fileProgres = document.querySelector(`#file-item-${uiniqueIndentifier} .file-progress`);
        const fileZise = document.querySelector(`#file-item-${uiniqueIndentifier} .file-size`);
        const progress = Math.round((event.loaded / event.total) * 100);

        fileProgres.style.width = `${progress}%`;
        fileZise.textContent = `${event.loaded} / ${event.total}`;
    });
    //opening connection to the server api endpoint and sendign the form data
    xhr.open('POST', `https://api.cloudinary.com/v1_1/dvxkqpj2v/image/upload`, true);
    xhr.send(formData);
};

//Function to handle selected file
const handleSelectedFile = ([...files]) => {
    if (files.length === 0) return; // cheked if no file are selected

    files.map((file, i) => {
        const uiniqueIndentifier = Date.now() + i;

        const fileHTML = createFileItemHTM(file, uiniqueIndentifier);
        //inserting each file item into lisr
        filesList.insertAdjacentHTML('afterbegin', fileHTML);
        handleFileUploading(file, uiniqueIndentifier);
    });
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
