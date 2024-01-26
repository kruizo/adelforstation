<div id="mapmodal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full min-w-full">
        <!-- Modal content -->
        <div id="modal-content" class="relative bg-gray-900 rounded-lg shadow dark:bg-gray-700 w-full ">
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4 w-full h-full">
                <iframe id="map" src="{{route('map.show')}}" class="w-full h-96"></iframe>

            </div>
            <p style="text-align:center;">The location is: <span id="locationtxt"></span></p>
            <div class="flex items-center gap-2 justify-center p-4 md:p-5">
                <x-button-primary type="button" class="w-fit bg-white text-black" onclick="resetmarker('map');" id="reset" text="Cancel">Cancel</x-button-primary>
                <x-button-primary type="button" class="w-fit" data-modal-hide="mapmodal" onclick="showMap();" id="confirm" text="Confirm"></x-button-primary>
            </div>
        </div>
    </div>
</div>