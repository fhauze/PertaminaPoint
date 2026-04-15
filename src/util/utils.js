import router from '@/router';
import { useToast } from "vue-toastification";
import EXIF from 'exif-js';

const toast = useToast();

// router.beforeEach(async (to, from, next) => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const token = urlParams.get('token') || localStorage.getItem('user_token');

//   if (token) {
//     localStorage.setItem('user_token', token);
//     next();
//   } else {
//     next('/unauthorized');
//   }
// });

export const errorMessage = (msg) => {
  toast.error(msg, {
    timeout: 4000,
    closeOnClick: true,
  });
};

export const warningMessage = (msg) => {
  toast.warning(msg, {
    position: "top-right",
  });
};

export const successMessage = (msg) => {
    toast.success(msg,{
        position: 'top-right',
    });
};

export const getTokenAuth = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('auth_token') || sessionStorage.getItem('auth_token');

    const authLocalStorage = localStorage.getItem('auth_token');
    if (authToken) {
        successMessage("token berhasil")
        if(authLocalStorage){
            localStorage.removeItem('auth_token');
        }
        sessionStorage.setItem('auth_token', authToken);
    }

    return authToken;
};


/**
 * Menghitung jarak antara dua koordinat dalam satuan meter
 * @param {number} lat1 - Latitude asal
 * @param {number} lon1 - Longitude asal
 * @param {number} lat2 - Latitude tujuan (user)
 * @param {number} lon2 - Longitude tujuan (user)
 * @returns {number} - Jarak dalam satuan meter
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getCurrentPosition = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    // const distance = calculateDistance(
    //   originLat,
    //   originLng,
    //   userLat,
    //   userLng
    // );

    console.log('Position :', [userLat, userLng]);

    // if (distance <= 50) {
    //   successMessage("Berhasil check-in");
    // } else {
    //   errorMessage("Anda berada di luar area");
    // }
  });
}

export const checkLocation = (originLat, originLng, maxRadius) => {
  if (!navigator.geolocation) return;

  navigator.geolocation.watchPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const distance = calculateDistance(userLat, userLng, originLat, originLng);
      const isWithinRadius = distance <= maxRadius;

      if (!isWithinRadius) {
        router.push('/out-of-range');
      }
    },
    (err) => {
      errorMessage("Akses lokasi ditolak:", err)
    },
    { enableHighAccuracy: true }
  );
};

export const getPhotoLocation = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("File tidak ditemukan"));
      return;
    }

    EXIF.getData(file, function () {
      const lat = EXIF.getTag(this, "GPSLatitude");
      const lon = EXIF.getTag(this, "GPSLongitude");
      const latRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";
      const lonRef = EXIF.getTag(this, "GPSLongitudeRef") || "E";

      if (lat && lon) {
        const coords = {
          lat: convertToDecimal(lat, latRef),
          lng: convertToDecimal(lon, lonRef),
        };
        resolve(coords);
      } else {
        resolve(null); // Resolving null jika data GPS tidak ada
      }
    });
  });
};

export const getDeviceInfo = (file) => {
  return new Promise((resolve) => {
    EXIF.getData(file, function () {
      const info = {
        brand: EXIF.getTag(this, "Make"),
        model: EXIF.getTag(this, "Model"),
        osVersion: EXIF.getTag(this, "Software"),
        takenDate: EXIF.getTag(this, "DateTimeOriginal"),
        exposureTime: EXIF.getTag(this, "ExposureTime"),
        iso: EXIF.getTag(this, "ISOSpeedRatings"),
      };
      
      // Jika ingin data mentah semua tag EXIF
      const allMetaData = EXIF.getAllTags(this);
      
      resolve({
        summary: info,
        raw: allMetaData
      });
    });
  });
};

export const convertToDecimal = (gpsData, gpsRef) => {
  if (!gpsData) return null;

  const degrees = gpsData[0].numerator / gpsData[0].denominator;
  const minutes = gpsData[1].numerator / gpsData[1].denominator;
  const seconds = gpsData[2].numerator / gpsData[2].denominator;

  let decimal = degrees + (minutes / 60) + (seconds / 3600);

  if (gpsRef === "S" || gpsRef === "W") {
    decimal = decimal * -1;
  }

  return decimal;
};

export const isLocationValid = (currLon, currLat) => {
  console.log(currLon, currLat);
}