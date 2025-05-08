import express from 'express'
import { createAdmin } from '../controllers/admin-dahboard/AddUsers.js'
import { loginAdmin } from '../controllers/admin-dahboard/LoginAdmin.js';
import { getAdminDashboardStats } from '../controllers/admin-dahboard/getTotalUsers.js';
import { getMonthlyBookingStats } from '../controllers/admin-dahboard/getMonthlyBookingStats.js';
import { getBookingsAnalyticsByCategory } from '../controllers/admin-dahboard/getBookingsAnalyticsByCategory.js';
import { addServiceProvider, addUser, deleteServiceProvider, deleteUser, getAllServiceProviders, getAllUsers, updateServiceProvider, updateUser } from '../controllers/admin-dahboard/Show,Add,Edit,DeleteUsers.js';
import { addMajorCategories, deleteCategory, getMajorCategories, updateMajorCategory } from '../controllers/majorCategory.controller.js';
import { banMajorListing, deleteMajorListing, getAllMajorListings, updateMajorListing } from '../controllers/admin-dahboard/Listings.js';

const router = express.Router()

router.route('/create').post(createAdmin)
router.post('/login', loginAdmin);
router.get('/get-dashboard-stats', getAdminDashboardStats);
router.get("/get-monthly-booking-stats", getMonthlyBookingStats);
router.get("/get-bookings-stats-byCategory", getBookingsAnalyticsByCategory);

//Show , Add , Edit & Delete Users
router.get("/users", getAllUsers);
router.post("/users", addUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

//Show , Add , Edit & Delete Providers
router.get("/providers", getAllServiceProviders);
router.post("/providers", addServiceProvider);
router.put("/providers/:id", updateServiceProvider);
router.delete("/providers/:id", deleteServiceProvider);

//Show , add , remove & update categories
router.get("/categories", getMajorCategories);
router.post("/categories", addMajorCategories);
router.put("/categories/:id", updateMajorCategory);
router.delete("/categories/:id", deleteCategory);

//Show , edit , remove & ban service listings 
router.get("/listings", getAllMajorListings);
router.put("/listings/:id", updateMajorListing);
router.delete("/listings/:id", deleteMajorListing);
router.put("/ban-listing/:banId", banMajorListing);


export default router