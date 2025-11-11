document.getElementById('comicImageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.match('image.*')) {
        Toast.error('Por favor selecciona un archivo de imagen válido (JPG, PNG, JPEG)');
        e.target.value = '';
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        Toast.error('La imagen no debe superar los 5MB');
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('previewImg').src = event.target.result;
        document.getElementById('imagePreview').classList.add('show');
    };
    reader.readAsDataURL(file);

    Toast.success('Imagen cargada correctamente');
});

document.getElementById('comicPDF').addEventListener('change', function(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
        Toast.error('Por favor selecciona un archivo PDF válido');
        e.target.value = '';
        return;
    }

    if (file.size > 50 * 1024 * 1024) {
        Toast.error('El PDF no debe superar los 50MB');
        e.target.value = '';
        return;
    }

    document.getElementById('pdfFileName').textContent = file.name;
    document.getElementById('pdfFileSize').textContent = formatFileSize(file.size);
    document.getElementById('pdfPreview').classList.add('show');

    Toast.success('PDF cargado correctamente');
});

function removeImagePreview() {
    document.getElementById('comicImageUpload').value = '';
    document.getElementById('previewImg').src = '';
    document.getElementById('imagePreview').classList.remove('show');
    Toast.info('Imagen removida');
}

function removePdfPreview() {
    document.getElementById('comicPDF').value = '';
    document.getElementById('pdfFileName').textContent = '';
    document.getElementById('pdfFileSize').textContent = '';
    document.getElementById('pdfPreview').classList.remove('show');
    Toast.info('PDF removido');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function resetForm() {
    if (confirm('¿Estás seguro de cancelar? Se perderán todos los datos ingresados.')) {
        document.getElementById('addComicForm').reset();
        removeImagePreview();
        removePdfPreview();
        Toast.info('Formulario reiniciado');
    }
}
