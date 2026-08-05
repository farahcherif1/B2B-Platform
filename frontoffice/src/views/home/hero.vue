<script>
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";

export default {
    data() {
        return {
            Autoplay,
        };
    },
    components: {
    },
    methods: {
        topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        },
        scrollToSection(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    },
    mounted() {

        let backtoTop = document.getElementById("back-to-top");

        if (backtoTop) {
            backtoTop = document.getElementById("back-to-top");
            window.onscroll = function () {
                if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                    backtoTop.style.display = "block";
                } else {
                    backtoTop.style.display = "none";
                }
            };
        }

        window.addEventListener('scroll', function (ev) {
            ev.preventDefault();
            var navbar = document.getElementById("navbar");
            if (navbar) {
                if (document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50) {
                    navbar.classList.add("is-sticky");
                } else {
                    navbar.classList.remove("is-sticky");
                }
            }
        });
    },
};
</script>

<template>
    <div class="layout-wrapper landing">


        <section class="section job-hero-section bg-light pb-0" id="hero">
            <BContainer>
                <BRow class="justify-content-between align-items-center">
                    <BCol lg="6">
                        <div>
                            <h1 class="display-6 fw-semibold text-capitalize mb-3 lh-base">Find the Next Event that Will boost your Business</h1>
                            <p class="lead text-muted lh-base mb-4">Find jobs, create trackable resumes and enrich your
                                applications. Carefully crafted after analyzing the needs of different industries.</p>
                            <form action="#" class="job-panel-filter">
                                <BRow class="g-md-0 g-2">
                                    <BCol md="4">
                                        <div>
                                            <input type="search" id="job-title" class="form-control filter-input-box"
                                                placeholder="Type event name...">
                                        </div>
                                    </BCol>
                                    <BCol md="4">
                                        <div>
                                            <select class="form-control" data-choices>
                                                <option value="">Select Event, type</option>
                                                <option value="Full Time">Full Time</option>
                                                <option value="Part Time">Part Time</option>
                                                <option value="Freelance">Freelance</option>
                                                <option value="Internship">Internship</option>
                                            </select>
                                        </div>
                                    </BCol>
                                    <BCol md="4">
                                        <div class="h-100">
                                            <BButton variant="primary" style="background-color: #8093a4;border: none;border-radius: 0 0 8px;" class="submit-btn w-100 h-100" type="submit"><i
                                                    class="ri-search-2-line align-bottom me-1"></i> Find Event</BButton>
                                        </div>
                                    </BCol>
                                </BRow>
                            </form>

                            <ul class="treding-keywords list-inline mb-0 mt-3 fs-13">
                                <li class="list-inline-item text-danger fw-semibold"><i
                                        class="mdi mdi-tag-multiple-outline align-middle"></i> Trending Keywords:</li>
                                <li class="list-inline-item">
                                    <BLink href="#">Design,</BLink>
                                </li>
                                <li class="list-inline-item">
                                    <BLink href="#">Development,</BLink>
                                </li>
                                <li class="list-inline-item">
                                    <BLink href="#">Manager,</BLink>
                                </li>
                                <li class="list-inline-item">
                                    <BLink href="#">Senior</BLink>
                                </li>
                            </ul>
                        </div>
                    </BCol>
                    <BCol lg="4">
                        <div class="position-relative home-img text-center mt-5 mt-lg-0">
                        
                            <img src="@/assets/images/job-profile2.png" alt="" class="user-img">

                            <div class="circle-effect">
                                <div class="circle"></div>
                                <div class="circle2"></div>
                                <div class="circle3"></div>
                                <div class="circle4"></div>
                            </div>
                        </div>
                    </BCol>
                </BRow>
            </BContainer>
        </section>

        <section class="section" id="process">
            <BContainer>
                <BRow class="justify-content-center">
                    <BCol lg="8">
                        <div class="text-center mb-5">
                            <h1 class="mb-3 ff-secondary fw-semibold lh-base">How <span class="text-primary">it's
                                    work</span> creative events & quickly features</h1>
                            <p class="text-muted">A creative person has the ability to invent and develop original
                                ideas, especially in the arts. Like so many creative people, he was never satisfied.</p>
                        </div>
                    </BCol>                            <p class="text-white-50 mb-0">Create new account and refer your friend</p>


                </BRow>
                <BRow>
                    <BCol lg="3" md="6">
                        <BCard no-body class="shadow-lg">
                            <BCardBody class="p-4">
                                <h1 class="fw-bold display-5 ff-secondary mb-4 text-success position-relative">
                                    <span class="text-cepex">1</span>
                                </h1>
                                <h6 class="fs-17 mb-2">Register Account</h6>
                                <p class="text-muted mb-0 fs-15">First, You need to make a account.</p>
                            </BCardBody>
                        </BCard>
                    </BCol>
                    <BCol lg="3" md="6">
                        <BCard no-body class="shadow-none">
                            <BCardBody class="p-4">
                                <h1 class="fw-bold display-5 ff-secondary mb-4 text-success position-relative">
                                    <span class="text-cepex">2</span>
                                </h1>
                                <h6 class="fs-17 mb-2">Find Event</h6>
                                <p class="text-muted mb-0 fs-15">Create a resume for your job.</p>
                            </BCardBody>
                        </BCard>
                    </BCol>
                    <BCol lg="3" md="6">
                        <BCard no-body class="shadow-none">
                            <BCardBody class="p-4">
                                <h1 class="fw-bold display-5 ff-secondary mb-4 text-success position-relative">
                                    <span class="text-cepex">3</span>
                                </h1>

                                <h6 class="fs-17 mb-2">Regiser to it</h6>
                                <p class="text-muted mb-0 fs-15">Search for your dream jobs from velzon.</p>
                            </BCardBody>
                        </BCard>
                    </BCol>
                    <BCol lg="3" md="6">
                        <BCard no-body class="shadow-none">
                            <BCardBody class="p-4">
                                <h1 class="fw-bold display-5 ff-secondary mb-4 text-success position-relative">
                                    <span class="text-cepex">4</span>
                                </h1>
                                <h6 class="fs-17 mb-2">Attend it and book meetings</h6>
                                <p class="text-muted mb-0 fs-15">Apply to the company and wait for interview.</p>
                            </BCardBody>
                        </BCard>
                    </BCol>
                </BRow>
            </BContainer>
        </section>

        <section class="section">
            <BContainer>
                <BRow class="align-items-center justify-content-lg-between justify-content-center gy-4">
                    <BCol lg="5" sm="7">
                        <div class="about-img-section mb-5 mb-lg-0 text-center">
                            
                            <img src="@/assets/images/about.jpg" alt="" class="img-fluid mx-auto rounded-3" />
                        </div>
                    </BCol>
                    <BCol lg="6">
                        <div class="text-muted">
                            <h1 class="mb-3 lh-base">Find Your <span class="text-primary">Dream Event</span> in One Place
                            </h1>
                            <p class="ff-secondary fs-16 mb-2">The first step in finding your <b>dream job </b> is
                                deciding where to look for first-hand insight. Contact professionals who are already
                                working in industries or positions that interest you.</p>
                            <p class="ff-secondary fs-16">Schedule informational interviews and phone calls or ask for
                                the opportunity to shadow them on the job.</p>

                            <div class="vstack gap-2 mb-4 pb-1">
                                <div class="d-flex align-items-center">
                                    <div class="flex-shrink-0 me-2">
                                        <div class="avatar-xs icon-effect">
                                            <div class="avatar-title bg-transparent text-success rounded-circle h2">
                                                <i class="ri-check-fill"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex-grow-1">
                                        <p class="mb-0">Dynamic Content</p>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center">
                                    <div class="flex-shrink-0 me-2">
                                        <div class="avatar-xs icon-effect">
                                            <div class="avatar-title bg-transparent text-success rounded-circle h2">
                                                <i class="ri-check-fill"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex-grow-1">
                                        <p class="mb-0">Setup plugin's information.</p>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center">
                                    <div class="flex-shrink-0 me-2">
                                        <div class="avatar-xs icon-effect">
                                            <div class="avatar-title bg-transparent text-success rounded-circle h2">
                                                <i class="ri-check-fill"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex-grow-1">
                                        <p class="mb-0">Themes customization information</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <BLink href="#!" class="btn btn-primary" style="background-color: #8093a4;border: none;border-radius: 8px;">Find Your Jobs <i
                                        class="ri-arrow-right-line align-bottom ms-1"></i></BLink>
                            </div>
                        </div>
                    </BCol>

                </BRow>
            </BContainer>
        </section>

        <section class="section bg-light" id="categories">
            <BContainer>
                <BRow class="justify-content-center">
                    <BCol lg="7">
                        <div class="text-center mb-5">
                            <h1 class="mb-3 ff-secondary fw-semibold text-capitalize lh-base">High demand jobs <span
                                    class="text-primary">Categories</span> featured</h1>
                            <p class="text-muted">Post a job to tell us about your project. We'll quickly match you with
                                the right freelancers.</p>
                        </div>
                    </BCol>
                </BRow>

                <BRow class="justify-content-center">
                    <BCol lg="3" md="6">
                        <BCard no-body class="shadow-none text-center py-3">
                            <BCardBody class="py-4">
                                <div class="avatar-sm position-relative mb-4 mx-auto">
                                    <div class="avatar-title bg-transparent text-success rounded-circle">
                                        <i class="ri-pencil-ruler-2-line fs-1 text-cepex"></i>
                                    </div>
                                </div>
                                <BLink href="#!" class="stretched-link">
                                    <h5 class="fs-17 pt-1">IT & Software</h5>
                                </BLink>
                                <p class="mb-0 text-muted">1543 Jobs</p>
                            </BCardBody>
                        </BCard>
                    </BCol>
                    <BCol lg="3" md="6">
                        <BCard no-body class="shadow-none text-center py-3">
                            <BCardBody class="py-4">
                                <div class="avatar-sm position-relative mb-4 mx-auto">
                                    <div class="avatar-title bg-transparent text-success rounded-circle">
                                        <i class="text-cepex ri-airplay-line fs-1"></i>
                                    </div>
                                </div>
                                <BLink href="#!" class="stretched-link">
                                    <h5 class="fs-17 pt-1">Construction / Facilities</h5>
                                </BLink>
                                <p class="mb-0 text-muted">3241 Jobs</p>
                            </BCardBody>
                        </BCard>
                    </BCol>
                    <BCol lg="3" md="6">
                        <BCard no-body class="shadow-none text-center py-3">
                            <BCardBody class="py-4">
                                <div class="avatar-sm mb-4 mx-auto position-relative">
                                    <div class="avatar-title bg-transparent text-success rounded-circle">
                                        <i class=" text-cepex ri-bank-line fs-1"></i>
                                    </div>
                                </div>
                                <BLink href="#!" class="stretched-link">
                                    <h5 class="fs-17 pt-1">Government</h5>
                                </BLink>
                                <p class="mb-0 text-muted">876 Jobs</p>
                            </BCardBody>
                        </BCard>
                    </BCol>
                    <BCol lg="3" md="6">
                        <BCard no-body class="shadow-none text-center py-3">
                            <BCardBody class="py-4">
                                <div class="avatar-sm position-relative mb-4 mx-auto">
                                    <div class="avatar-title bg-transparent text-success rounded-circle">
                                        <i class="text-cepex ri-focus-2-line fs-1"></i>
                                    </div>
                                </div>
                                <BLink href="#!" class="stretched-link">
                                    <h5 class="fs-17 pt-1">Marketing & Advertising</h5>
                                </BLink>
                                <p class="mb-0 text-muted">465 Jobs</p>
                            </BCardBody>
                        </BCard>
                    </BCol>
                    <BCol lg="3" md="6">
                        <BCard no-body class="shadow-none text-center py-3">
                            <BCardBody class="py-4">
                                <div class="avatar-sm position-relative mb-4 mx-auto">
                                    <div class="avatar-title bg-transparent text-success rounded-circle">
                                        <i class="text-cepex ri-pencil-ruler-line fs-1"></i>
                                    </div>
                                </div>
                                <BLink href="#!" class="stretched-link">
                                    <h5 class="fs-17 pt-1">Education & training</h5>
                                </BLink>
                                <p class="mb-0 text-muted">105 Jobs</p>
                            </BCardBody>
                        </BCard>
                    </BCol>
                    <BCol lg="3" md="6">
                        <BCard no-body class="shadow-none text-center py-3">
                            <BCardBody class="py-4">
                                <div class="avatar-sm position-relative mb-4 mx-auto">
$                                    <div class="avatar-title bg-transparent text-success rounded-circle">
                                        <i class="text-cepex ri-line-chart-line fs-1"></i>
                                    </div>
                                </div>
                                <BLink href="#!" class="stretched-link">
                                    <h5 class="fs-17 pt-1">Digital Marketing</h5>
                                </BLink>
                                <p class="mb-0 text-muted">377 Jobs</p>
                            </BCardBody>
                        </BCard>
                    </BCol>
                    <BCol lg="3" md="6">
                        <BCard no-body class="shadow-none text-center py-3">
                            <BCardBody class="py-4">
                                <div class="avatar-sm position-relative mb-4 mx-auto">
                                    <div class="avatar-title bg-transparent text-success rounded-circle">
                                        <i class="text-cepex ri-briefcase-2-line fs-1"></i>
                                    </div>
                                </div>
                                <BLink href="#!" class="stretched-link">
                                    <h5 class="fs-17 pt-1">Catering & Tourism</h5>
                                </BLink>
                                <p class="mb-0 text-muted">85 Jobs</p>
                            </BCardBody>
                        </BCard>
                    </BCol>
                </BRow>
            </BContainer>
        </section>

        <section class="py-5 bg-blue position-relative">
            <div class="bg-overlay bg-overlay-pattern opacity-50"></div>
            <BContainer>
                <BRow class="align-items-center gy-4">
                    <BCol sm>
                        <div>
                            <h4 class="text-white mb-2">Ready to Started?</h4>
                        </div>
                    </BCol>

                    <BCol sm="auto">
                        <div>
                            <BLink href="#!" class="btn bg-gradient btn-danger">Create Free Account</BLink>
                        </div>
                    </BCol>

                </BRow>
            </BContainer>
        </section>
        <br>

        <BButton variant="info" @click="topFunction" class="btn-icon" id="back-to-top">
            <i class="ri-arrow-up-line"></i>
        </BButton>
    </div>
</template>
