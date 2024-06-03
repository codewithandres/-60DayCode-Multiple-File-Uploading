
const fileBrowserButton = document.querySelector('.file-browse-button');
const filebrowseInput = document.querySelector('.file-browse-input');
const fileUploadBox = document.querySelector('.file-upload-box');

//Function to handle selected file
const handleSelectedFile = files => {
    console.log(files);
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
